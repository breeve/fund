class FundInfo {
  final String code;
  final String name;
  final String type;
  final String company;
  final String? manager;
  final String launchDate;
  final double? scale;
  final int? riskLevel;

  FundInfo({
    required this.code,
    required this.name,
    required this.type,
    required this.company,
    this.manager,
    required this.launchDate,
    this.scale,
    this.riskLevel,
  });

  factory FundInfo.fromJson(Map<String, dynamic> json) => FundInfo(
        code: json['code'] as String? ?? json['fundcode'] as String? ?? '',
        name: json['name'] as String? ?? '',
        type: json['type'] as String? ?? '',
        company: json['company'] as String? ?? '',
        manager: json['manager'] as String?,
        launchDate: json['launchDate'] as String? ?? '',
        scale: (json['scale'] as num?)?.toDouble(),
        riskLevel: json['riskLevel'] as int?,
      );

  Map<String, dynamic> toJson() => {
        'code': code,
        'name': name,
        'type': type,
        'company': company,
        'manager': manager,
        'launchDate': launchDate,
        'scale': scale,
        'riskLevel': riskLevel,
      };
}

class FundNAV {
  final String date;
  final double nav;
  final double? accNav;
  final double changePct;

  FundNAV({
    required this.date,
    required this.nav,
    this.accNav,
    required this.changePct,
  });

  factory FundNAV.fromJson(Map<String, dynamic> json) => FundNAV(
        date: json['date'] as String? ?? '',
        nav: (json['nav'] as num?)?.toDouble() ?? 0,
        accNav: (json['accNav'] as num?)?.toDouble(),
        changePct: (json['changePct'] as num?)?.toDouble() ?? 0,
      );

  Map<String, dynamic> toJson() => {
        'date': date,
        'nav': nav,
        'accNav': accNav,
        'changePct': changePct,
      };
}

class FundHolding {
  final int rank;
  final String name;
  final String? code;
  final double proportion;
  final String? industry;

  FundHolding({
    required this.rank,
    required this.name,
    this.code,
    required this.proportion,
    this.industry,
  });

  factory FundHolding.fromJson(Map<String, dynamic> json) => FundHolding(
        rank: json['rank'] as int? ?? 0,
        name: json['name'] as String? ?? '',
        code: json['code'] as String?,
        proportion: (json['proportion'] as num?)?.toDouble() ?? 0,
        industry: json['industry'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'rank': rank,
        'name': name,
        'code': code,
        'proportion': proportion,
        'industry': industry,
      };
}

class RiskMetrics {
  final double volatility;
  final double maxDrawdown;
  final double sharpeRatio;
  final double correlationToMarket;

  RiskMetrics({
    required this.volatility,
    required this.maxDrawdown,
    required this.sharpeRatio,
    required this.correlationToMarket,
  });

  factory RiskMetrics.fromJson(Map<String, dynamic> json) => RiskMetrics(
        volatility: (json['volatility'] as num?)?.toDouble() ?? 0,
        maxDrawdown: (json['maxDrawdown'] as num?)?.toDouble() ?? 0,
        sharpeRatio: (json['sharpeRatio'] as num?)?.toDouble() ?? 0,
        correlationToMarket: (json['correlationToMarket'] as num?)?.toDouble() ?? 0,
      );

  Map<String, dynamic> toJson() => {
        'volatility': volatility,
        'maxDrawdown': maxDrawdown,
        'sharpeRatio': sharpeRatio,
        'correlationToMarket': correlationToMarket,
      };
}

class FundDiagnosis {
  final FundInfo fundInfo;
  final List<FundNAV> navHistory;
  final List<FundHolding> topHoldings;
  final Map<String, double>? industryDistribution;
  final RiskMetrics riskMetrics;
  final int rating;
  final String? recommendation;

  FundDiagnosis({
    required this.fundInfo,
    required this.navHistory,
    required this.topHoldings,
    this.industryDistribution,
    required this.riskMetrics,
    required this.rating,
    this.recommendation,
  });

  factory FundDiagnosis.fromJson(Map<String, dynamic> json) => FundDiagnosis(
        fundInfo: FundInfo.fromJson(json['fundInfo'] as Map<String, dynamic>),
        navHistory: (json['navHistory'] as List<dynamic>?)
                ?.map((e) => FundNAV.fromJson(e as Map<String, dynamic>))
                .toList() ??
            [],
        topHoldings: (json['topHoldings'] as List<dynamic>?)
                ?.map((e) => FundHolding.fromJson(e as Map<String, dynamic>))
                .toList() ??
            [],
        industryDistribution:
            (json['industryDistribution'] as Map<String, dynamic>?)?.map(
          (k, v) => MapEntry(k, (v as num).toDouble()),
        ),
        riskMetrics:
            RiskMetrics.fromJson(json['riskMetrics'] as Map<String, dynamic>),
        rating: json['rating'] as int? ?? 3,
        recommendation: json['recommendation'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'fundInfo': fundInfo.toJson(),
        'navHistory': navHistory.map((e) => e.toJson()).toList(),
        'topHoldings': topHoldings.map((e) => e.toJson()).toList(),
        'industryDistribution': industryDistribution,
        'riskMetrics': riskMetrics.toJson(),
        'rating': rating,
        'recommendation': recommendation,
      };
}
