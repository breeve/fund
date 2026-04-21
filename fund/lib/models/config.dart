class AppConfig {
  final String marketDataProvider;
  final String llmProvider;
  final String llmModel;
  final String theme;
  final String locale;
  final String dataDir;
  final CustomApiEndpoints? customApiEndpoints;

  AppConfig({
    required this.marketDataProvider,
    required this.llmProvider,
    required this.llmModel,
    required this.theme,
    required this.locale,
    required this.dataDir,
    this.customApiEndpoints,
  });

  factory AppConfig.defaults() => AppConfig(
        marketDataProvider: 'eastmoney',
        llmProvider: 'openai',
        llmModel: 'gpt-4o-mini',
        theme: 'light',
        locale: 'zh-CN',
        dataDir: './data',
      );

  factory AppConfig.fromJson(Map<String, dynamic> json) => AppConfig(
        marketDataProvider:
            json['marketDataProvider'] as String? ?? 'eastmoney',
        llmProvider: json['llmProvider'] as String? ?? 'openai',
        llmModel: json['llmModel'] as String? ?? 'gpt-4o-mini',
        theme: json['theme'] as String? ?? 'light',
        locale: json['locale'] as String? ?? 'zh-CN',
        dataDir: json['dataDir'] as String? ?? './data',
        customApiEndpoints: json['customApiEndpoints'] != null
            ? CustomApiEndpoints.fromJson(
                json['customApiEndpoints'] as Map<String, dynamic>)
            : null,
      );

  Map<String, dynamic> toJson() => {
        'marketDataProvider': marketDataProvider,
        'llmProvider': llmProvider,
        'llmModel': llmModel,
        'theme': theme,
        'locale': locale,
        'dataDir': dataDir,
        'customApiEndpoints': customApiEndpoints?.toJson(),
      };

  AppConfig copyWith({
    String? marketDataProvider,
    String? llmProvider,
    String? llmModel,
    String? theme,
    String? locale,
    String? dataDir,
    CustomApiEndpoints? customApiEndpoints,
  }) =>
      AppConfig(
        marketDataProvider: marketDataProvider ?? this.marketDataProvider,
        llmProvider: llmProvider ?? this.llmProvider,
        llmModel: llmModel ?? this.llmModel,
        theme: theme ?? this.theme,
        locale: locale ?? this.locale,
        dataDir: dataDir ?? this.dataDir,
        customApiEndpoints: customApiEndpoints ?? this.customApiEndpoints,
      );
}

class CustomApiEndpoints {
  final String? fundSearch;
  final String? fundInfo;
  final String? fundNav;
  final String? fundHoldings;

  CustomApiEndpoints({
    this.fundSearch,
    this.fundInfo,
    this.fundNav,
    this.fundHoldings,
  });

  factory CustomApiEndpoints.defaults() => CustomApiEndpoints(
        fundSearch: 'https://fund.eastmoney.com/ajax/ranking/',
        fundInfo: 'https://fundgz.1234567.com.cn/js/{code}.js',
        fundNav: 'https://push2his.eastmoney.com/api/qt/stock/kline/get',
        fundHoldings: 'https://fundf10.eastmoney.com/FundArchives/Net.aspx',
      );

  factory CustomApiEndpoints.fromJson(Map<String, dynamic> json) =>
      CustomApiEndpoints(
        fundSearch: json['fundSearch'] as String?,
        fundInfo: json['fundInfo'] as String?,
        fundNav: json['fundNav'] as String?,
        fundHoldings: json['fundHoldings'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'fundSearch': fundSearch,
        'fundInfo': fundInfo,
        'fundNav': fundNav,
        'fundHoldings': fundHoldings,
      };
}

class UserPreferences {
  final String theme;
  final String locale;
  final String defaultView;
  final String dateFormat;
  final String currency;
  final bool showTips;

  UserPreferences({
    required this.theme,
    required this.locale,
    required this.defaultView,
    required this.dateFormat,
    required this.currency,
    required this.showTips,
  });

  factory UserPreferences.defaults() => UserPreferences(
        theme: 'light',
        locale: 'zh-CN',
        defaultView: 'overview',
        dateFormat: 'YYYY-MM-DD',
        currency: 'CNY',
        showTips: true,
      );

  factory UserPreferences.fromJson(Map<String, dynamic> json) =>
      UserPreferences(
        theme: json['theme'] as String? ?? 'light',
        locale: json['locale'] as String? ?? 'zh-CN',
        defaultView: json['defaultView'] as String? ?? 'overview',
        dateFormat: json['dateFormat'] as String? ?? 'YYYY-MM-DD',
        currency: json['currency'] as String? ?? 'CNY',
        showTips: json['showTips'] as bool? ?? true,
      );

  Map<String, dynamic> toJson() => {
        'theme': theme,
        'locale': locale,
        'defaultView': defaultView,
        'dateFormat': dateFormat,
        'currency': currency,
        'showTips': showTips,
      };

  UserPreferences copyWith({
    String? theme,
    String? locale,
    String? defaultView,
    String? dateFormat,
    String? currency,
    bool? showTips,
  }) =>
      UserPreferences(
        theme: theme ?? this.theme,
        locale: locale ?? this.locale,
        defaultView: defaultView ?? this.defaultView,
        dateFormat: dateFormat ?? this.dateFormat,
        currency: currency ?? this.currency,
        showTips: showTips ?? this.showTips,
      );
}
