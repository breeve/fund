import 'package:flutter/material.dart';

class AppTheme {
  // ============================================
  // Apple Warm Palette — SF-inspired, cozy not cold
  // ============================================

  // Primary - 暖琥珀金
  static const Color primary = Color(0xFFD4A574);
  static const Color primaryLight = Color(0xFFE8C49A);
  static const Color primaryDark = Color(0xFFA67C52);

  // Accent - 珊瑚橙
  static const Color accent = Color(0xFFE07B54);
  static const Color accentLight = Color(0xFFF0A080);

  // Background - 暖白/米白
  static const Color bgLight = Color(0xFFFAF7F2);
  static const Color bgCream = Color(0xFFF5F0E8);
  static const Color surfaceLight = Color(0xFFFFFFFF);

  // Text - 暖棕
  static const Color textPrimary = Color(0xFF2C2416);
  static const Color textSecondary = Color(0xFF6B5D4D);
  static const Color textMuted = Color(0xFF9E8E7E);

  // Borders & Dividers
  static const Color border = Color(0xFFE8E0D5);
  static const Color borderLight = Color(0xFFF0EBE3);
  static const Color divider = Color(0xFFE8E0D5);

  // Status Colors
  static const Color success = Color(0xFF3D7C47); // 暖绿
  static const Color error = Color(0xFFCF4446);  // 暖红
  static const Color warning = Color(0xFFD4A574); // 暖金

  // Category Colors
  static const Color categoryFund = Color(0xFFD4A574);
  static const Color categoryPrivateFund = Color(0xFFA67C52);
  static const Color categoryStrategy = Color(0xFFE07B54);
  static const Color categoryFixed = Color(0xFF3D7C47);
  static const Color categoryLiquid = Color(0xFFD4A574);
  static const Color categoryDerivative = Color(0xFFB8860B);
  static const Color categoryProtection = Color(0xFF2E6B4A);

  // Chart Colors
  static const Color chart1 = Color(0xFFD4A574);
  static const Color chart2 = Color(0xFFE07B54);
  static const Color chart3 = Color(0xFF3D7C47);
  static const Color chart4 = Color(0xFFA67C52);
  static const Color chart5 = Color(0xFFB8860B);
  static const Color chart6 = Color(0xFF2E6B4A);

  static ThemeData get theme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primary,
        brightness: Brightness.light,
        primary: primary,
        onPrimary: Colors.white,
        secondary: accent,
        onSecondary: Colors.white,
        surface: surfaceLight,
        onSurface: textPrimary,
        error: error,
        onError: Colors.white,
      ),
      scaffoldBackgroundColor: bgLight,

      appBarTheme: const AppBarTheme(
        backgroundColor: surfaceLight,
        foregroundColor: textPrimary,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: textPrimary,
          letterSpacing: 0.3,
        ),
        iconTheme: IconThemeData(color: textPrimary),
        surfaceTintColor: Colors.transparent,
      ),

      cardTheme: CardThemeData(
        color: surfaceLight,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: border, width: 1),
        ),
        margin: EdgeInsets.zero,
      ),

      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceLight,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: primary, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: error),
        ),
        hintStyle: const TextStyle(color: textMuted),
      ),

      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          elevation: 0,
          textStyle: const TextStyle(fontWeight: FontWeight.w600, letterSpacing: 0.3),
        ),
      ),

      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primary,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          side: const BorderSide(color: primary),
          textStyle: const TextStyle(fontWeight: FontWeight.w600, letterSpacing: 0.3),
        ),
      ),

      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: primary,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          textStyle: const TextStyle(fontWeight: FontWeight.w600, letterSpacing: 0.3),
        ),
      ),

      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: accent,
        foregroundColor: Colors.white,
        elevation: 2,
        shape: CircleBorder(),
      ),

      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: surfaceLight,
        indicatorColor: primary.withValues(alpha: 0.12),
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return const TextStyle(color: primary, fontSize: 12, fontWeight: FontWeight.w600);
          }
          return const TextStyle(color: textSecondary, fontSize: 12);
        }),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return const IconThemeData(color: primary, size: 24);
          }
          return const IconThemeData(color: textSecondary, size: 24);
        }),
      ),

      navigationRailTheme: NavigationRailThemeData(
        backgroundColor: surfaceLight,
        indicatorColor: primary.withValues(alpha: 0.12),
        selectedIconTheme: const IconThemeData(color: primary, size: 24),
        unselectedIconTheme: const IconThemeData(color: textSecondary, size: 24),
        selectedLabelTextStyle: const TextStyle(color: primary, fontSize: 12, fontWeight: FontWeight.w600),
        unselectedLabelTextStyle: const TextStyle(color: textSecondary, fontSize: 12),
      ),

      dividerTheme: const DividerThemeData(
        color: divider,
        thickness: 1,
        space: 1,
      ),

      chipTheme: ChipThemeData(
        backgroundColor: bgCream,
        selectedColor: primary.withValues(alpha: 0.12),
        labelStyle: const TextStyle(color: textPrimary, fontSize: 13),
        side: const BorderSide(color: border),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),

      dialogTheme: DialogThemeData(
        backgroundColor: surfaceLight,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: const BorderSide(color: border),
        ),
        titleTextStyle: const TextStyle(color: textPrimary, fontSize: 18, fontWeight: FontWeight.w600),
      ),

      snackBarTheme: SnackBarThemeData(
        backgroundColor: textPrimary,
        contentTextStyle: const TextStyle(color: surfaceLight),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        behavior: SnackBarBehavior.floating,
      ),

      textTheme: const TextTheme(
        displayLarge: TextStyle(color: textPrimary, fontWeight: FontWeight.bold),
        displayMedium: TextStyle(color: textPrimary, fontWeight: FontWeight.bold),
        displaySmall: TextStyle(color: textPrimary, fontWeight: FontWeight.bold),
        headlineLarge: TextStyle(color: textPrimary, fontWeight: FontWeight.w600),
        headlineMedium: TextStyle(color: textPrimary, fontWeight: FontWeight.w600),
        headlineSmall: TextStyle(color: textPrimary, fontWeight: FontWeight.w600),
        titleLarge: TextStyle(color: textPrimary, fontWeight: FontWeight.w600),
        titleMedium: TextStyle(color: textPrimary, fontWeight: FontWeight.w500),
        titleSmall: TextStyle(color: textPrimary, fontWeight: FontWeight.w500),
        bodyLarge: TextStyle(color: textPrimary),
        bodyMedium: TextStyle(color: textPrimary),
        bodySmall: TextStyle(color: textSecondary),
        labelLarge: TextStyle(color: textPrimary, fontWeight: FontWeight.w500),
        labelMedium: TextStyle(color: textSecondary),
        labelSmall: TextStyle(color: textMuted),
      ),
    );
  }

  static const Map<String, Color> categoryColors = {
    'fund': categoryFund,
    'private_fund': categoryPrivateFund,
    'strategy': categoryStrategy,
    'fixed': categoryFixed,
    'liquid': categoryLiquid,
    'derivative': categoryDerivative,
    'protection': categoryProtection,
  };

  static const Map<String, String> categoryNames = {
    'fund': '公募基金',
    'private_fund': '私募基金',
    'strategy': '策略',
    'fixed': '定期',
    'liquid': '活钱',
    'derivative': '金融衍生品',
    'protection': '保障',
  };
}
