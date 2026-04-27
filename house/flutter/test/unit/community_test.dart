import 'package:flutter_test/flutter_test.dart';
import 'package:house_app/models/community.dart';

void main() {
  group('Community model', () {
    test('fromJson parses all fields correctly', () {
      final json = {
        'id': 42,
        'name': '阳光小区',
        'official_name': '阳光花园一期',
        'address': '深圳市南山区科技园路',
        'completion_year': 2015,
        'land_area': 15000.0,
        'building_area': 45000.0,
        'plot_ratio': 3.0,
        'greening_rate': 0.35,
        'listing_price': 55000.0,
        'deal_price': 52000.0,
        'nearest_metro': '科技园站',
      };

      final community = Community.fromJson(json);

      expect(community.id, 42);
      expect(community.name, '阳光小区');
      expect(community.greeningRate, 0.35);
      expect(community.dealPrice, 52000.0);
      expect(community.completionYear, 2015);
    });

    test('toJson produces correct output', () {
      final community = Community()
        ..id = 1
        ..name = '测试小区'
        ..greeningRate = 0.40
        ..dealPrice = 48000;

      final json = community.toJson();

      expect(json['id'], 1);
      expect(json['name'], '测试小区');
      expect(json['greening_rate'], 0.40);
      expect(json['deal_price'], 48000);
    });

    test('handles null optional fields', () {
      final json = {
        'id': 1,
        'name': '最小小区',
        'greening_rate': null,
        'deal_price': null,
        'nearest_metro': null,
      };

      final community = Community.fromJson(json);

      expect(community.id, 1);
      expect(community.greeningRate, isNull);
      expect(community.dealPrice, isNull);
      expect(community.nearestMetro, isNull);
    });
  });
}