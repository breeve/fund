import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/storage.dart';

final storageServiceProvider = Provider<StorageService>((ref) {
  return StorageService();
});
