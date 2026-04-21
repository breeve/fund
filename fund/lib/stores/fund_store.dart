import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/fund.dart';
import '../services/fund_api.dart';

final fundApiServiceProvider = Provider<FundApiService>((ref) => FundApiService());

final fundStoreProvider =
    StateNotifierProvider<FundStoreNotifier, FundState>((ref) {
  return FundStoreNotifier(ref.watch(fundApiServiceProvider));
});

class FundState {
  final List<FundInfo> searchResults;
  final FundInfo? selectedFund;
  final List<FundNAV> navHistory;
  final List<FundHolding> topHoldings;
  final bool isLoading;
  final String? error;

  FundState({
    this.searchResults = const [],
    this.selectedFund,
    this.navHistory = const [],
    this.topHoldings = const [],
    this.isLoading = false,
    this.error,
  });

  FundState copyWith({
    List<FundInfo>? searchResults,
    FundInfo? selectedFund,
    List<FundNAV>? navHistory,
    List<FundHolding>? topHoldings,
    bool? isLoading,
    String? error,
  }) =>
      FundState(
        searchResults: searchResults ?? this.searchResults,
        selectedFund: selectedFund ?? this.selectedFund,
        navHistory: navHistory ?? this.navHistory,
        topHoldings: topHoldings ?? this.topHoldings,
        isLoading: isLoading ?? this.isLoading,
        error: error,
      );
}

class FundStoreNotifier extends StateNotifier<FundState> {
  final FundApiService _api;

  FundStoreNotifier(this._api) : super(FundState());

  Future<void> searchFunds(String keyword) async {
    if (keyword.trim().isEmpty) {
      state = state.copyWith(searchResults: []);
      return;
    }

    state = state.copyWith(isLoading: true, error: null);
    try {
      final results = await _api.searchFunds(keyword);
      state = state.copyWith(searchResults: results, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> selectFund(String code) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final fundInfo = await _api.getFundInfo(code);
      if (fundInfo == null) {
        state = state.copyWith(
          error: '无法获取基金信息',
          isLoading: false,
        );
        return;
      }

      final navHistory = await _api.getFundNAV(code);
      final topHoldings = await _api.getFundHoldings(code);

      state = state.copyWith(
        selectedFund: fundInfo,
        navHistory: navHistory,
        topHoldings: topHoldings,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  void clearSelection() {
    state = FundState();
  }

  void clearError() {
    state = state.copyWith(error: null);
  }

  // Calculate risk metrics from NAV history
  RiskMetrics calculateRiskMetrics() {
    if (state.navHistory.length < 2) {
      return RiskMetrics(
        volatility: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
        correlationToMarket: 0,
      );
    }

    final returns = <double>[];
    for (var i = 1; i < state.navHistory.length; i++) {
      final prev = state.navHistory[i - 1].nav;
      final curr = state.navHistory[i].nav;
      if (prev != 0) {
        returns.add((curr - prev) / prev);
      }
    }

    if (returns.isEmpty) {
      return RiskMetrics(
        volatility: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
        correlationToMarket: 0,
      );
    }

    // Calculate volatility (standard deviation of returns)
    final mean = returns.reduce((a, b) => a + b) / returns.length;
    final variance =
        returns.map((r) => (r - mean) * (r - mean)).reduce((a, b) => a + b) /
            returns.length;
    final volatility = variance > 0 ? variance * 100 : 0;

    // Calculate max drawdown
    double maxDrawdown = 0;
    double peak = state.navHistory.first.nav;
    for (final nav in state.navHistory) {
      if (nav.nav > peak) peak = nav.nav;
      final drawdown = (peak - nav.nav) / peak;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }

    // Simplified Sharpe Ratio (assuming 0% risk-free rate)
    final sharpeRatio = mean != 0 ? (mean / (variance > 0 ? variance : 0.001)) : 0;

    return RiskMetrics(
      volatility: volatility * 100,
      maxDrawdown: maxDrawdown * 100,
      sharpeRatio: sharpeRatio * 100,
      correlationToMarket: 0.5, // Simplified - would need market data for real value
    );
  }

  // Calculate rating based on risk metrics (1-5 stars)
  int calculateRating(RiskMetrics metrics) {
    var score = 0;

    // Lower volatility is better
    if (metrics.volatility < 10) score += 2;
    else if (metrics.volatility < 20) score += 1;

    // Lower max drawdown is better
    if (metrics.maxDrawdown < 10) score += 2;
    else if (metrics.maxDrawdown < 20) score += 1;

    // Higher Sharpe ratio is better
    if (metrics.sharpeRatio > 1) score += 1;

    return (score + 1).clamp(1, 5);
  }
}
