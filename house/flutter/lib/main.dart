import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'router/app_router.dart';
import 'theme/app_theme.dart';
import 'services/storage.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final storage = StorageService();
  await storage.init();

  runApp(const ProviderScope(child: HouseApp()));
}

class HouseApp extends StatelessWidget {
  const HouseApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: '房产管理系统',
      theme: AppTheme.lightTheme,
      routerConfig: appRouter,
      debugShowCheckedModeBanner: false,
    );
  }
}
