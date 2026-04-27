import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'theme/app_theme.dart';
import 'stores/asset_store.dart';
import 'pages/overview_page.dart';
import 'pages/assets_page.dart';
import 'pages/asset_form_page.dart';
import 'pages/asset_detail_page.dart';
import 'pages/fund_page.dart';
import 'pages/fund_diagnosis_page.dart';
import 'pages/settings_page.dart';
import 'services/storage.dart';
import 'widgets/app_shell.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final storage = StorageService();
  await storage.init();

  runApp(
    ProviderScope(
      overrides: [storageServiceProvider.overrideWithValue(storage)],
      child: const FundApp(),
    ),
  );
}

final router = GoRouter(
  initialLocation: '/',
  routes: [
    ShellRoute(
      builder: (context, state, child) => AppShell(child: child),
      routes: [
        GoRoute(path: '/', builder: (context, state) => const OverviewPage()),
        GoRoute(
          path: '/assets',
          builder: (context, state) => const AssetsPage(),
        ),
        GoRoute(
          path: '/assets/new',
          builder: (context, state) => const AssetFormPage(),
        ),
        GoRoute(
          path: '/assets/:id',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return AssetDetailPage(assetId: id);
          },
        ),
        GoRoute(
          path: '/assets/:id/edit',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return AssetFormPage(assetId: id);
          },
        ),
        GoRoute(path: '/fund', builder: (context, state) => const FundPage()),
        GoRoute(
          path: '/fund/:code',
          builder: (context, state) {
            final code = state.pathParameters['code']!;
            return FundDiagnosisPage(fundCode: code);
          },
        ),
        GoRoute(
          path: '/settings',
          builder: (context, state) => const SettingsPage(),
        ),
      ],
    ),
  ],
);

class FundApp extends StatelessWidget {
  const FundApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: '家庭资产管理系统',
      theme: AppTheme.theme,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}
