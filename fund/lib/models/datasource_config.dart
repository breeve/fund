import 'package:hive_flutter/hive_flutter.dart';

part 'datasource_config.g.dart';

/// Represents a data source configuration.
class DataSourceConfig {
  final String id;
  final String name;
  final String description;
  final Map<String, String> endpoints;
  final bool enabled;

  const DataSourceConfig({
    required this.id,
    required this.name,
    required this.description,
    required this.endpoints,
    this.enabled = true,
  });

  factory DataSourceConfig.fromJson(Map<String, dynamic> json) {
    return DataSourceConfig(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      endpoints: Map<String, String>.from(json['endpoints'] as Map),
      enabled: json['enabled'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description,
        'endpoints': endpoints,
        'enabled': enabled,
      };

  DataSourceConfig copyWith({
    String? id,
    String? name,
    String? description,
    Map<String, String>? endpoints,
    bool? enabled,
  }) {
    return DataSourceConfig(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      endpoints: endpoints ?? this.endpoints,
      enabled: enabled ?? this.enabled,
    );
  }
}

/// Available data sources (hardcoded for now, could be fetched from server)
const availableDataSources = [
  DataSourceConfig(
    id: 'eastmoney',
    name: '东方财富 (EastMoney)',
    description: 'Primary data source - 东方财富网',
    endpoints: {
      'fundInfo': 'https://fundgz.1234567.com.cn/js',
      'fundNAV': 'https://fundf10.eastmoney.com/F10DataApi.aspx',
      'fundHoldings': 'https://fundf10.eastmoney.com/FundArchivesDatas.aspx',
    },
  ),
  DataSourceConfig(
    id: 'eastmoney_f10',
    name: '东方财富 F10 (EastMoney F10)',
    description: 'Alternative F10 data interface',
    endpoints: {
      'fundInfo': 'https://fundf10.eastmoney.com/QuoteManagement.aspx',
      'fundNAV': 'https://fundf10.eastmoney.com/F10DataApi.aspx',
      'fundHoldings': 'https://fundf10.eastmoney.com/FundArchivesDatas.aspx',
    },
  ),
];

/// Manages data source configuration persistence.
class DataSourceConfigStore {
  static const String _boxName = 'datasource_config';
  static const String _configKey = 'current_datasource';
  static const String _serverPortKey = 'server_port';

  Box? _box;

  Future<void> init() async {
    if (!Hive.isBoxOpen(_boxName)) {
      _box = await Hive.openBox(_boxName);
    } else {
      _box = Hive.box(_boxName);
    }
  }

  /// Get the current data source ID.
  String get currentDataSourceId => _box?.get(_configKey, defaultValue: 'eastmoney') as String;

  /// Set the current data source ID.
  Future<void> setDataSource(String id) async {
    await _box?.put(_configKey, id);
  }

  /// Get the current data source config.
  DataSourceConfig get currentDataSource {
    return availableDataSources.firstWhere(
      (ds) => ds.id == currentDataSourceId,
      orElse: () => availableDataSources.first,
    );
  }

  /// Get stored server port (for desktop/mobile).
  int? get serverPort => _box?.get(_serverPortKey) as int?;

  /// Store server port (for desktop/mobile).
  Future<void> setServerPort(int port) async {
    await _box?.put(_serverPortKey, port);
  }

  /// Get all available data sources.
  List<DataSourceConfig> get allDataSources => availableDataSources;
}
