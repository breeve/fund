import 'package:go_router/go_router.dart';
import '../pages/overview_page.dart';
import '../pages/districts_page.dart';
import '../pages/blocks_page.dart';
import '../pages/life_circles_page.dart';
import '../pages/communities_page.dart';
import '../pages/community_detail_page.dart';
import '../pages/settings_page.dart';
import '../widgets/app_shell.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    ShellRoute(
      builder: (context, state, child) => AppShell(child: child),
      routes: [
        GoRoute(
          path: '/',
          builder: (context, state) => const OverviewPage(),
        ),
        GoRoute(
          path: '/districts',
          builder: (context, state) => const DistrictsPage(),
        ),
        GoRoute(
          path: '/blocks',
          builder: (context, state) => const BlocksPage(),
        ),
        GoRoute(
          path: '/life-circles',
          builder: (context, state) => const LifeCirclesPage(),
        ),
        GoRoute(
          path: '/communities',
          builder: (context, state) => const CommunitiesPage(),
        ),
        GoRoute(
          path: '/communities/:id',
          builder: (context, state) {
            final id = int.parse(state.pathParameters['id']!);
            return CommunityDetailPage(communityId: id);
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
