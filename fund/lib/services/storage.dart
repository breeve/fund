import 'package:hive_flutter/hive_flutter.dart';
import '../models/asset.dart';
import '../models/config.dart';

class StorageService {
  static const String _assetsBoxName = 'assets';
  static const String _configBoxName = 'config';

  late Box<Map> _assetsBox;
  late Box<Map> _configBox;

  Future<void> init() async {
    await Hive.initFlutter();
    _assetsBox = await Hive.openBox<Map>(_assetsBoxName);
    _configBox = await Hive.openBox<Map>(_configBoxName);
  }

  // Assets CRUD
  Future<List<BaseAsset>> getAssets() async {
    final assets = <BaseAsset>[];
    for (final key in _assetsBox.keys) {
      final json = _assetsBox.get(key);
      if (json != null) {
        final asset = _assetFromJson(Map<String, dynamic>.from(json));
        if (asset != null) assets.add(asset);
      }
    }
    return assets;
  }

  Future<void> saveAsset(BaseAsset asset) async {
    await _assetsBox.put(asset.id, asset.toJson());
  }

  Future<void> deleteAsset(String id) async {
    await _assetsBox.delete(id);
  }

  Future<void> clearAssets() async {
    await _assetsBox.clear();
  }

  // Config
  Future<AppConfig> getConfig() async {
    final json = _configBox.get('appConfig');
    if (json != null) {
      return AppConfig.fromJson(Map<String, dynamic>.from(json));
    }
    return AppConfig.defaults();
  }

  Future<void> saveConfig(AppConfig config) async {
    await _configBox.put('appConfig', config.toJson());
  }

  Future<UserPreferences> getPreferences() async {
    final json = _configBox.get('preferences');
    if (json != null) {
      return UserPreferences.fromJson(Map<String, dynamic>.from(json));
    }
    return UserPreferences.defaults();
  }

  Future<void> savePreferences(UserPreferences prefs) async {
    await _configBox.put('preferences', prefs.toJson());
  }

  BaseAsset? _assetFromJson(Map<String, dynamic> json) {
    final categoryStr = json['category'] as String?;
    final category = AssetCategory.values.firstWhere(
      (e) => e.name == categoryStr,
      orElse: () => AssetCategory.fund,
    );

    switch (category) {
      case AssetCategory.fund:
        return PublicFundAsset.fromJson(json);
      case AssetCategory.privateFund:
        return PrivateFundAsset.fromJson(json);
      case AssetCategory.strategy:
        return StrategyAsset.fromJson(json);
      case AssetCategory.fixed:
        return FixedTermAsset.fromJson(json);
      case AssetCategory.liquid:
        return LiquidAsset.fromJson(json);
      case AssetCategory.derivative:
        return DerivativeAsset.fromJson(json);
      case AssetCategory.protection:
        return ProtectionAsset.fromJson(json);
    }
  }
}
