import 'package:dio/dio.dart';
import '../models/district.dart';
import '../models/block.dart';
import '../models/life_circle.dart';
import '../models/community.dart';

class HouseApiService {
  HouseApiService({String? baseUrl})
      : _dio = Dio(BaseOptions(
          baseUrl: baseUrl ?? 'http://localhost:8080',
          connectTimeout: const Duration(seconds: 10),
          receiveTimeout: const Duration(seconds: 30),
        ));

  final Dio _dio;

  // Districts
  Future<List<District>> getDistricts() async {
    final response = await _dio.get('/districts');
    final data = response.data as List<dynamic>;
    return data.map((e) => District.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<District> getDistrict(int id) async {
    final response = await _dio.get('/districts/$id');
    return District.fromJson(response.data as Map<String, dynamic>);
  }

  // Blocks
  Future<List<Block>> getBlocks({int? districtId}) async {
    final response = await _dio.get('/blocks', queryParameters: {
      if (districtId != null) 'district_id': districtId,
    });
    final data = response.data as List<dynamic>;
    return data.map((e) => Block.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Block> getBlock(int id) async {
    final response = await _dio.get('/blocks/$id');
    return Block.fromJson(response.data as Map<String, dynamic>);
  }

  // Life Circles
  Future<List<LifeCircle>> getLifeCircles({int? blockId}) async {
    final response = await _dio.get('/life-circles', queryParameters: {
      if (blockId != null) 'block_id': blockId,
    });
    final data = response.data as List<dynamic>;
    return data.map((e) => LifeCircle.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<LifeCircle> getLifeCircle(int id) async {
    final response = await _dio.get('/life-circles/$id');
    return LifeCircle.fromJson(response.data as Map<String, dynamic>);
  }

  // Communities
  Future<List<Community>> getCommunities({
    int? blockId,
    int? lifeCircleId,
    double? priceMin,
    double? priceMax,
  }) async {
    final response = await _dio.get('/communities', queryParameters: {
      if (blockId != null) 'block_id': blockId,
      if (lifeCircleId != null) 'life_circle_id': lifeCircleId,
      if (priceMin != null) 'price_min': priceMin,
      if (priceMax != null) 'price_max': priceMax,
    });
    final data = response.data as List<dynamic>;
    return data.map((e) => Community.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Community> getCommunity(int id) async {
    final response = await _dio.get('/communities/$id');
    return Community.fromJson(response.data as Map<String, dynamic>);
  }
}
