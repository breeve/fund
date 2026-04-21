import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/house_api.dart';

final houseApiServiceProvider = Provider<HouseApiService>((ref) {
  return HouseApiService();
});
