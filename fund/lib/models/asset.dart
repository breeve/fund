enum AssetCategory {
  fund,
  privateFund,
  strategy,
  fixed,
  liquid,
  derivative,
  protection,
}

extension AssetCategoryExtension on AssetCategory {
  String get displayName {
    switch (this) {
      case AssetCategory.fund:
        return '公募基金';
      case AssetCategory.privateFund:
        return '私募基金';
      case AssetCategory.strategy:
        return '策略';
      case AssetCategory.fixed:
        return '定期';
      case AssetCategory.liquid:
        return '活钱';
      case AssetCategory.derivative:
        return '金融衍生品';
      case AssetCategory.protection:
        return '保障';
    }
  }

  String get color {
    switch (this) {
      case AssetCategory.fund:
        return '#3b82f6';
      case AssetCategory.privateFund:
        return '#8b5cf6';
      case AssetCategory.strategy:
        return '#ec4899';
      case AssetCategory.fixed:
        return '#22c55e';
      case AssetCategory.liquid:
        return '#f59e0b';
      case AssetCategory.derivative:
        return '#f97316';
      case AssetCategory.protection:
        return '#06b6d4';
    }
  }
}

class BaseAsset {
  final String id;
  final String name;
  final AssetCategory category;
  final String subType;
  final List<String> tags;
  final String notes;
  final String entryTime;
  final String createdAt;
  final String updatedAt;

  BaseAsset({
    required this.id,
    required this.name,
    required this.category,
    required this.subType,
    required this.tags,
    required this.notes,
    required this.entryTime,
    required this.createdAt,
    required this.updatedAt,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'category': category.name,
        'subType': subType,
        'tags': tags,
        'notes': notes,
        'entryTime': entryTime,
        'createdAt': createdAt,
        'updatedAt': updatedAt,
      };

  factory BaseAsset.fromJson(Map<String, dynamic> json) => BaseAsset(
        id: json['id'] as String,
        name: json['name'] as String,
        category: AssetCategory.values.firstWhere(
          (e) => e.name == json['category'],
          orElse: () => AssetCategory.fund,
        ),
        subType: json['subType'] as String? ?? '',
        tags: (json['tags'] as List<dynamic>?)?.cast<String>() ?? [],
        notes: json['notes'] as String? ?? '',
        entryTime: json['entryTime'] as String? ?? '',
        createdAt: json['createdAt'] as String? ?? '',
        updatedAt: json['updatedAt'] as String? ?? '',
      );
}

class PublicFundAsset extends BaseAsset {
  final String? code;
  final double? sharpeRatio;
  final List<String>? topHoldings;
  final String source;
  final double total;
  final double profit;

  PublicFundAsset({
    required super.id,
    required super.name,
    required super.subType,
    required super.tags,
    required super.notes,
    required super.entryTime,
    required super.createdAt,
    required super.updatedAt,
    this.code,
    this.sharpeRatio,
    this.topHoldings,
    required this.source,
    required this.total,
    required this.profit,
  }) : super(category: AssetCategory.fund);

  double get cost => total - profit;
  double get returnRate => cost != 0 ? (profit / cost * 100) : 0;

  @override
  Map<String, dynamic> toJson() => {
        ...super.toJson(),
        'code': code,
        'sharpeRatio': sharpeRatio,
        'topHoldings': topHoldings,
        'source': source,
        'total': total,
        'profit': profit,
      };

  factory PublicFundAsset.fromJson(Map<String, dynamic> json) => PublicFundAsset(
        id: json['id'] as String,
        name: json['name'] as String,
        subType: json['subType'] as String? ?? '',
        tags: (json['tags'] as List<dynamic>?)?.cast<String>() ?? [],
        notes: json['notes'] as String? ?? '',
        entryTime: json['entryTime'] as String? ?? '',
        createdAt: json['createdAt'] as String? ?? '',
        updatedAt: json['updatedAt'] as String? ?? '',
        code: json['code'] as String?,
        sharpeRatio: (json['sharpeRatio'] as num?)?.toDouble(),
        topHoldings: (json['topHoldings'] as List<dynamic>?)?.cast<String>(),
        source: json['source'] as String? ?? '',
        total: (json['total'] as num?)?.toDouble() ?? 0,
        profit: (json['profit'] as num?)?.toDouble() ?? 0,
      );
}

class PrivateFundAsset extends BaseAsset {
  final String? code;
  final String source;
  final double total;
  final double profit;

  PrivateFundAsset({
    required super.id,
    required super.name,
    required super.subType,
    required super.tags,
    required super.notes,
    required super.entryTime,
    required super.createdAt,
    required super.updatedAt,
    this.code,
    required this.source,
    required this.total,
    required this.profit,
  }) : super(category: AssetCategory.privateFund);

  double get cost => total - profit;
  double get returnRate => cost != 0 ? (profit / cost * 100) : 0;

  @override
  Map<String, dynamic> toJson() => {
        ...super.toJson(),
        'code': code,
        'source': source,
        'total': total,
        'profit': profit,
      };

  factory PrivateFundAsset.fromJson(Map<String, dynamic> json) => PrivateFundAsset(
        id: json['id'] as String,
        name: json['name'] as String,
        subType: json['subType'] as String? ?? '',
        tags: (json['tags'] as List<dynamic>?)?.cast<String>() ?? [],
        notes: json['notes'] as String? ?? '',
        entryTime: json['entryTime'] as String? ?? '',
        createdAt: json['createdAt'] as String? ?? '',
        updatedAt: json['updatedAt'] as String? ?? '',
        code: json['code'] as String?,
        source: json['source'] as String? ?? '',
        total: (json['total'] as num?)?.toDouble() ?? 0,
        profit: (json['profit'] as num?)?.toDouble() ?? 0,
      );
}

class StrategyAsset extends BaseAsset {
  final String source;
  final double total;
  final double profit;

  StrategyAsset({
    required super.id,
    required super.name,
    required super.subType,
    required super.tags,
    required super.notes,
    required super.entryTime,
    required super.createdAt,
    required super.updatedAt,
    required this.source,
    required this.total,
    required this.profit,
  }) : super(category: AssetCategory.strategy);

  double get cost => total - profit;
  double get returnRate => cost != 0 ? (profit / cost * 100) : 0;

  @override
  Map<String, dynamic> toJson() => {
        ...super.toJson(),
        'source': source,
        'total': total,
        'profit': profit,
      };

  factory StrategyAsset.fromJson(Map<String, dynamic> json) => StrategyAsset(
        id: json['id'] as String,
        name: json['name'] as String,
        subType: json['subType'] as String? ?? '',
        tags: (json['tags'] as List<dynamic>?)?.cast<String>() ?? [],
        notes: json['notes'] as String? ?? '',
        entryTime: json['entryTime'] as String? ?? '',
        createdAt: json['createdAt'] as String? ?? '',
        updatedAt: json['updatedAt'] as String? ?? '',
        source: json['source'] as String? ?? '',
        total: (json['total'] as num?)?.toDouble() ?? 0,
        profit: (json['profit'] as num?)?.toDouble() ?? 0,
      );
}

class FixedTermAsset extends BaseAsset {
  final int duration;
  final String startDate;
  final String source;
  final double annualReturn;
  final double investmentAmount;

  FixedTermAsset({
    required super.id,
    required super.name,
    required super.subType,
    required super.tags,
    required super.notes,
    required super.entryTime,
    required super.createdAt,
    required super.updatedAt,
    required this.duration,
    required this.startDate,
    required this.source,
    required this.annualReturn,
    required this.investmentAmount,
  }) : super(category: AssetCategory.fixed);

  @override
  Map<String, dynamic> toJson() => {
        ...super.toJson(),
        'duration': duration,
        'startDate': startDate,
        'source': source,
        'annualReturn': annualReturn,
        'investmentAmount': investmentAmount,
      };

  factory FixedTermAsset.fromJson(Map<String, dynamic> json) => FixedTermAsset(
        id: json['id'] as String,
        name: json['name'] as String,
        subType: json['subType'] as String? ?? '',
        tags: (json['tags'] as List<dynamic>?)?.cast<String>() ?? [],
        notes: json['notes'] as String? ?? '',
        entryTime: json['entryTime'] as String? ?? '',
        createdAt: json['createdAt'] as String? ?? '',
        updatedAt: json['updatedAt'] as String? ?? '',
        duration: json['duration'] as int? ?? 0,
        startDate: json['startDate'] as String? ?? '',
        source: json['source'] as String? ?? '',
        annualReturn: (json['annualReturn'] as num?)?.toDouble() ?? 0,
        investmentAmount: (json['investmentAmount'] as num?)?.toDouble() ?? 0,
      );
}

class LiquidAsset extends BaseAsset {
  final String source;
  final double total;

  LiquidAsset({
    required super.id,
    required super.name,
    required super.subType,
    required super.tags,
    required super.notes,
    required super.entryTime,
    required super.createdAt,
    required super.updatedAt,
    required this.source,
    required this.total,
  }) : super(category: AssetCategory.liquid);

  @override
  Map<String, dynamic> toJson() => {
        ...super.toJson(),
        'source': source,
        'total': total,
      };

  factory LiquidAsset.fromJson(Map<String, dynamic> json) => LiquidAsset(
        id: json['id'] as String,
        name: json['name'] as String,
        subType: json['subType'] as String? ?? '',
        tags: (json['tags'] as List<dynamic>?)?.cast<String>() ?? [],
        notes: json['notes'] as String? ?? '',
        entryTime: json['entryTime'] as String? ?? '',
        createdAt: json['createdAt'] as String? ?? '',
        updatedAt: json['updatedAt'] as String? ?? '',
        source: json['source'] as String? ?? '',
        total: (json['total'] as num?)?.toDouble() ?? 0,
      );
}

class DerivativeAsset extends BaseAsset {
  final String source;
  final double total;
  final double profit;

  DerivativeAsset({
    required super.id,
    required super.name,
    required super.subType,
    required super.tags,
    required super.notes,
    required super.entryTime,
    required super.createdAt,
    required super.updatedAt,
    required this.source,
    required this.total,
    required this.profit,
  }) : super(category: AssetCategory.derivative);

  double get cost => total - profit;
  double get returnRate => cost != 0 ? (profit / cost * 100) : 0;

  @override
  Map<String, dynamic> toJson() => {
        ...super.toJson(),
        'source': source,
        'total': total,
        'profit': profit,
      };

  factory DerivativeAsset.fromJson(Map<String, dynamic> json) => DerivativeAsset(
        id: json['id'] as String,
        name: json['name'] as String,
        subType: json['subType'] as String? ?? '',
        tags: (json['tags'] as List<dynamic>?)?.cast<String>() ?? [],
        notes: json['notes'] as String? ?? '',
        entryTime: json['entryTime'] as String? ?? '',
        createdAt: json['createdAt'] as String? ?? '',
        updatedAt: json['updatedAt'] as String? ?? '',
        source: json['source'] as String? ?? '',
        total: (json['total'] as num?)?.toDouble() ?? 0,
        profit: (json['profit'] as num?)?.toDouble() ?? 0,
      );
}

class ProtectionAsset extends BaseAsset {
  ProtectionAsset({
    required super.id,
    required super.name,
    required super.subType,
    required super.tags,
    required super.notes,
    required super.entryTime,
    required super.createdAt,
    required super.updatedAt,
  }) : super(category: AssetCategory.protection);

  @override
  Map<String, dynamic> toJson() => {
        ...super.toJson(),
      };

  factory ProtectionAsset.fromJson(Map<String, dynamic> json) => ProtectionAsset(
        id: json['id'] as String,
        name: json['name'] as String,
        subType: json['subType'] as String? ?? '',
        tags: (json['tags'] as List<dynamic>?)?.cast<String>() ?? [],
        notes: json['notes'] as String? ?? '',
        entryTime: json['entryTime'] as String? ?? '',
        createdAt: json['createdAt'] as String? ?? '',
        updatedAt: json['updatedAt'] as String? ?? '',
      );
}

typedef Asset = dynamic;
