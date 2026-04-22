import 'package:dio/dio.dart';
import '../models/fund.dart';

/// Server configuration for fund API.
/// All fund diagnosis requests go through the backend server.
class ServerConfig {
  /// Default server URL when running server locally.
  /// Web: Connect to localhost:8081
  /// Desktop/Mobile: Same, when bundled server is running.
  static const String defaultServerUrl = 'http://localhost:8081';

  /// Get the current server URL from config if available,
  /// otherwise fall back to default.
  static String getServerUrl() {
    // Could be extended to read from config store
    return defaultServerUrl;
  }
}

/// Abstract interface for fund API service.
abstract class FundApiServiceInterface {
  Future<FundInfo?> getFundInfo(String code);
  Future<List<FundNAV>> getFundNAV(String code);
  Future<List<FundHolding>> getFundHoldings(String code);
  Future<List<FundInfo>> searchFunds(String keyword);
}

class FundApiException implements Exception {
  final String message;
  FundApiException(this.message);

  @override
  String toString() => message;
}

/// Factory that creates the appropriate API implementation.
class FundApiFactory {
  static FundApiService create(Dio dio) {
    return FundApiService(dio);
  }
}

/// Unified API service that routes all requests through the backend server.
/// The server (bin/server.dart) handles data source access and CORS.
class FundApiService implements FundApiServiceInterface {
  final Dio _dio;
  late final String _baseUrl;

  FundApiService(this._dio) {
    _baseUrl = ServerConfig.getServerUrl();
  }

  @override
  Future<FundInfo?> getFundInfo(String code) async {
    try {
      final response = await _dio.get('$_baseUrl/api/fund/$code/info');
      final data = response.data as Map<String, dynamic>;

      if (data.containsKey('error')) {
        return null;
      }

      return FundInfo(
        code: data['code'] as String? ?? code,
        name: data['name'] as String? ?? '',
        type: data['type'] as String? ?? '',
        company: data['company'] as String? ?? '',
        launchDate: data['launchDate'] as String? ?? '',
      );
    } catch (e) {
      throw FundApiException('获取基金信息失败: $e');
    }
  }

  @override
  Future<List<FundNAV>> getFundNAV(String code) async {
    try {
      final response = await _dio.get('$_baseUrl/api/fund/$code/nav');
      final data = response.data as Map<String, dynamic>;
      final navHistory = data['navHistory'] as List<dynamic>? ?? [];

      return navHistory.map((e) => FundNAV(
        date: e['date'] as String? ?? '',
        nav: (e['nav'] as num?)?.toDouble() ?? 0,
        accNav: (e['accNav'] as num?)?.toDouble(),
        changePct: (e['changePct'] as num?)?.toDouble() ?? 0,
      )).toList();
    } catch (e) {
      throw FundApiException('获取净值历史失败: $e');
    }
  }

  @override
  Future<List<FundHolding>> getFundHoldings(String code) async {
    try {
      final response = await _dio.get('$_baseUrl/api/fund/$code/holdings');
      final data = response.data as Map<String, dynamic>;
      final holdings = data['holdings'] as List<dynamic>? ?? [];

      return holdings.map((e) => FundHolding(
        rank: e['rank'] as int? ?? 0,
        name: e['name'] as String? ?? '',
        code: e['code'] as String?,
        proportion: (e['proportion'] as num?)?.toDouble() ?? 0,
        industry: e['industry'] as String?,
      )).toList();
    } catch (e) {
      throw FundApiException('获取持仓信息失败: $e');
    }
  }

  @override
  Future<List<FundInfo>> searchFunds(String keyword) async {
    if (keyword.trim().isEmpty) return [];

    // Only support 6-digit fund code search
    if (!RegExp(r'^\d{6}$').hasMatch(keyword.trim())) {
      return [];
    }

    try {
      final response = await _dio.get(
        '$_baseUrl/api/fund/search',
        queryParameters: {'q': keyword.trim()},
      );
      final data = response.data as Map<String, dynamic>;
      final funds = data['funds'] as List<dynamic>? ?? [];

      return funds.map((e) => FundInfo(
        code: e['code'] as String? ?? '',
        name: e['name'] as String? ?? '',
        type: e['type'] as String? ?? '',
        company: e['company'] as String? ?? '',
        launchDate: e['launchDate'] as String? ?? '',
      )).toList();
    } catch (e) {
      throw FundApiException('搜索基金失败: $e');
    }
  }
}

/// Legacy stub required by conditional import - not used anymore.
Future<int?> startProxyServer() async => null;

/// Legacy web fetch - not used anymore.
Future<String> fetchUrl(String url) async {
  final dio = Dio();
  final response = await dio.get(url);
  return response.data as String;
}
