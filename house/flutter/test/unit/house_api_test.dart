import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:house_app/services/house_api.dart';
import 'package:house_app/models/district.dart';

class MockDio extends Mock implements Dio {}

void main() {
  late MockDio mockDio;

  setUpAll(() {
    registerFallbackValue(RequestOptions(path: '/'));
  });

  setUp(() {
    mockDio = MockDio();
  });

  group('HouseApiService', () {
    group('getDistricts', () {
      test('parses wrapped response envelope correctly', () async {
        when(() => mockDio.get('/districts')).thenAnswer(
          (_) async => Response(
            data: {
              'data': [
                {'id': 1, 'code': '440305', 'name': '南山区'},
                {'id': 2, 'code': '440303', 'name': '罗湖区'},
              ]
            },
            statusCode: 200,
            requestOptions: RequestOptions(path: '/districts'),
          ),
        );

        final service = HouseApiService(dio: mockDio);
        final districts = await service.getDistricts();

        expect(districts, hasLength(2));
        expect(districts[0].name, '南山区');
        expect(districts[1].name, '罗湖区');
        verify(() => mockDio.get('/districts')).called(1);
      });

      test('returns empty list when no data', () async {
        when(() => mockDio.get('/districts')).thenAnswer(
          (_) async => Response(
            data: {'data': []},
            statusCode: 200,
            requestOptions: RequestOptions(path: '/districts'),
          ),
        );

        final service = HouseApiService(dio: mockDio);
        final districts = await service.getDistricts();

        expect(districts, isEmpty);
      });

      test('throws when response is not wrapped', () async {
        when(() => mockDio.get('/districts')).thenAnswer(
          (_) async => Response(
            data: [
              {'id': 1, 'name': '南山区'}
            ],
            statusCode: 200,
            requestOptions: RequestOptions(path: '/districts'),
          ),
        );

        final service = HouseApiService(dio: mockDio);
        expect(
          () => service.getDistricts(),
          throwsA(isA<TypeError>()),
        );
      });
    });

    group('getBlocks', () {
      test('passes district_id query parameter', () async {
        when(() => mockDio.get('/blocks', queryParameters: {'district_id': 5}))
            .thenAnswer(
          (_) async => Response(
            data: {'data': []},
            statusCode: 200,
            requestOptions: RequestOptions(path: '/blocks'),
          ),
        );

        final service = HouseApiService(dio: mockDio);
        await service.getBlocks(districtId: 5);

        verify(() => mockDio.get('/blocks', queryParameters: {'district_id': 5}))
            .called(1);
      });

      test('sends no query params when districtId is null', () async {
        when(() => mockDio.get('/blocks')).thenAnswer(
          (_) async => Response(
            data: {'data': []},
            statusCode: 200,
            requestOptions: RequestOptions(path: '/blocks'),
          ),
        );

        final service = HouseApiService(dio: mockDio);
        await service.getBlocks();

        verify(() => mockDio.get('/blocks')).called(1);
      });
    });

    group('getCommunities', () {
      test('sends all filter parameters', () async {
        when(() => mockDio.get(
              '/communities',
              queryParameters: {
                'block_id': 3,
                'life_circle_id': 7,
                'price_min': 30000.0,
                'price_max': 60000.0,
              },
            )).thenAnswer(
          (_) async => Response(
            data: {'data': []},
            statusCode: 200,
            requestOptions: RequestOptions(path: '/communities'),
          ),
        );

        final service = HouseApiService(dio: mockDio);
        await service.getCommunities(
          blockId: 3,
          lifeCircleId: 7,
          priceMin: 30000,
          priceMax: 60000,
        );

        verify(() => mockDio.get(
              '/communities',
              queryParameters: {
                'block_id': 3,
                'life_circle_id': 7,
                'price_min': 30000.0,
                'price_max': 60000.0,
              },
            )).called(1);
      });
    });

    group('getDistrict', () {
      test('parses single item from wrapped response', () async {
        when(() => mockDio.get('/districts/1')).thenAnswer(
          (_) async => Response(
            data: {
              'data': {'id': 1, 'code': '440305', 'name': '南山区'}
            },
            statusCode: 200,
            requestOptions: RequestOptions(path: '/districts/1'),
          ),
        );

        final service = HouseApiService(dio: mockDio);
        final district = await service.getDistrict(1);

        expect(district.id, 1);
        expect(district.name, '南山区');
      });
    });
  });
}