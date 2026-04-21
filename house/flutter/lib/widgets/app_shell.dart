import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_theme.dart';

class AppShell extends StatelessWidget {
  const AppShell({super.key, required this.child});

  final Widget child;

  static const _navItems = [
    _NavItem(
      icon: Icons.home_outlined,
      selectedIcon: Icons.home,
      label: '总览',
      path: '/',
    ),
    _NavItem(
      icon: Icons.map_outlined,
      selectedIcon: Icons.map,
      label: '行政区',
      path: '/districts',
    ),
    _NavItem(
      icon: Icons.domain_outlined,
      selectedIcon: Icons.domain,
      label: '板块',
      path: '/blocks',
    ),
    _NavItem(
      icon: Icons.circle_outlined,
      selectedIcon: Icons.circle,
      label: '生活圈',
      path: '/life-circles',
    ),
    _NavItem(
      icon: Icons.apartment_outlined,
      selectedIcon: Icons.apartment,
      label: '小区',
      path: '/communities',
    ),
    _NavItem(
      icon: Icons.settings_outlined,
      selectedIcon: Icons.settings,
      label: '设置',
      path: '/settings',
    ),
  ];

  int _getCurrentIndex(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;
    if (location.startsWith('/districts')) return 1;
    if (location.startsWith('/blocks')) return 2;
    if (location.startsWith('/life-circles')) return 3;
    if (location.startsWith('/communities')) return 4;
    if (location.startsWith('/settings')) return 5;
    return 0;
  }

  void _onDestinationSelected(BuildContext context, int index) {
    final path = _navItems[index].path;
    context.go(path);
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.sizeOf(context).width;
    final isDesktop = screenWidth > 800;
    final isTablet = screenWidth > 600 && screenWidth <= 800;
    final currentIndex = _getCurrentIndex(context);

    if (isDesktop) {
      return _DesktopShell(
        currentIndex: currentIndex,
        onDestinationSelected: (index) =>
            _onDestinationSelected(context, index),
        child: child,
      );
    }

    if (isTablet) {
      return _TabletShell(
        currentIndex: currentIndex,
        onDestinationSelected: (index) =>
            _onDestinationSelected(context, index),
        child: child,
      );
    }

    return _MobileShell(
      currentIndex: currentIndex,
      onDestinationSelected: (index) => _onDestinationSelected(context, index),
      child: child,
    );
  }
}

class _NavItem {
  const _NavItem({
    required this.icon,
    required this.selectedIcon,
    required this.label,
    required this.path,
  });

  final IconData icon;
  final IconData selectedIcon;
  final String label;
  final String path;
}

class _DesktopShell extends StatelessWidget {
  const _DesktopShell({
    required this.currentIndex,
    required this.onDestinationSelected,
    required this.child,
  });

  final int currentIndex;
  final void Function(int) onDestinationSelected;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          NavigationRail(
            selectedIndex: currentIndex,
            onDestinationSelected: onDestinationSelected,
            backgroundColor: AppTheme.surfaceLight,
            indicatorColor: AppTheme.primary.withValues(alpha: 0.15),
            labelType: NavigationRailLabelType.all,
            leading: Padding(
              padding: const EdgeInsets.symmetric(vertical: 24),
              child: Column(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: AppTheme.primary,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(
                      Icons.apartment,
                      color: Colors.white,
                      size: 28,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    '房产',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                ],
              ),
            ),
            destinations: AppShell._navItems.map((item) {
              return NavigationRailDestination(
                icon: Icon(item.icon),
                selectedIcon: Icon(item.selectedIcon),
                label: Text(item.label),
              );
            }).toList(),
          ),
          const VerticalDivider(width: 1, thickness: 1),
          Expanded(child: child),
        ],
      ),
    );
  }
}

class _TabletShell extends StatelessWidget {
  const _TabletShell({
    required this.currentIndex,
    required this.onDestinationSelected,
    required this.child,
  });

  final int currentIndex;
  final void Function(int) onDestinationSelected;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          NavigationRail(
            selectedIndex: currentIndex,
            onDestinationSelected: onDestinationSelected,
            backgroundColor: AppTheme.surfaceLight,
            indicatorColor: AppTheme.primary.withValues(alpha: 0.15),
            labelType: NavigationRailLabelType.selected,
            leading: Padding(
              padding: const EdgeInsets.symmetric(vertical: 16),
              child: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppTheme.primary,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(
                  Icons.apartment,
                  color: Colors.white,
                  size: 24,
                ),
              ),
            ),
            destinations: AppShell._navItems.map((item) {
              return NavigationRailDestination(
                icon: Icon(item.icon),
                selectedIcon: Icon(item.selectedIcon),
                label: Text(item.label),
              );
            }).toList(),
          ),
          const VerticalDivider(width: 1, thickness: 1),
          Expanded(child: child),
        ],
      ),
    );
  }
}

class _MobileShell extends StatelessWidget {
  const _MobileShell({
    required this.currentIndex,
    required this.onDestinationSelected,
    required this.child,
  });

  final int currentIndex;
  final void Function(int) onDestinationSelected;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: child,
      bottomNavigationBar: NavigationBar(
        selectedIndex: currentIndex,
        onDestinationSelected: onDestinationSelected,
        backgroundColor: AppTheme.surfaceLight,
        indicatorColor: AppTheme.primary.withValues(alpha: 0.15),
        destinations: AppShell._navItems.map((item) {
          return NavigationDestination(
            icon: Icon(item.icon),
            selectedIcon: Icon(item.selectedIcon),
            label: item.label,
          );
        }).toList(),
      ),
    );
  }
}
