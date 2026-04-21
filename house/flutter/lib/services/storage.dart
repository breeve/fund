import 'package:hive_flutter/hive_flutter.dart';
import '../models/district.dart';
import '../models/block.dart';
import '../models/life_circle.dart';
import '../models/community.dart';

class StorageService {
  static const String _districtBox = 'districts';
  static const String _blockBox = 'blocks';
  static const String _lifeCircleBox = 'lifeCircles';
  static const String _communityBox = 'communities';

  Future<void> init() async {
    await Hive.initFlutter();

    Hive.registerAdapter(DistrictAdapter());
    Hive.registerAdapter(BlockAdapter());
    Hive.registerAdapter(LifeCircleAdapter());
    Hive.registerAdapter(CommunityAdapter());

    await Hive.openBox<District>(_districtBox);
    await Hive.openBox<Block>(_blockBox);
    await Hive.openBox<LifeCircle>(_lifeCircleBox);
    await Hive.openBox<Community>(_communityBox);
  }

  Box<District> get districtBox => Hive.box<District>(_districtBox);
  Box<Block> get blockBox => Hive.box<Block>(_blockBox);
  Box<LifeCircle> get lifeCircleBox => Hive.box<LifeCircle>(_lifeCircleBox);
  Box<Community> get communityBox => Hive.box<Community>(_communityBox);

  // Districts
  Future<void> saveDistricts(List<District> districts) async {
    final box = districtBox;
    await box.clear();
    for (final d in districts) {
      await box.put(d.id, d);
    }
  }

  List<District> getDistricts() => districtBox.values.toList();

  // Blocks
  Future<void> saveBlocks(List<Block> blocks) async {
    final box = blockBox;
    await box.clear();
    for (final b in blocks) {
      await box.put(b.id, b);
    }
  }

  List<Block> getBlocks() => blockBox.values.toList();

  // Life Circles
  Future<void> saveLifeCircles(List<LifeCircle> circles) async {
    final box = lifeCircleBox;
    await box.clear();
    for (final c in circles) {
      await box.put(c.id, c);
    }
  }

  List<LifeCircle> getLifeCircles() => lifeCircleBox.values.toList();

  // Communities
  Future<void> saveCommunities(List<Community> communities) async {
    final box = communityBox;
    await box.clear();
    for (final c in communities) {
      await box.put(c.id, c);
    }
  }

  List<Community> getCommunities() => communityBox.values.toList();
}
