import 'package:dio/dio.dart';
import '../models/fund.dart';

class FundApiService {
  final Dio _dio;

  static const String _fundGzUrl = 'https://fundgz.1234567.com.cn/js';
  static const String _push2HisUrl =
      'https://push2his.eastmoney.com/api/qt/stock/kline/get';
  static const String _fundF10Url =
      'https://fundf10.eastmoney.com/FundArchives/Net.aspx';

  FundApiService({Dio? dio})
      : _dio = dio ??
            Dio(BaseOptions(
              connectTimeout: const Duration(seconds: 10),
              receiveTimeout: const Duration(seconds: 30),
            ));

  /// Get fund info by code (fundgz API)
  /// Returns JSONP format: jsonpgz({"fundcode":"000001",...})
  Future<FundInfo?> getFundInfo(String code) async {
    try {
      final url = '$_fundGzUrl/$code.js';
      final response = await _dio.get(
        url,
        options: Options(
          headers: {
            'Accept': '*/*',
            'Referer': 'https://fund.eastmoney.com/',
          },
        ),
      );

      final text = response.data as String;
      // Parse JSONP: jsonpgz({...})
      final match = RegExp(r'jsonpgz\((.*)\)').firstMatch(text);
      if (match != null && match.group(1) != null) {
        final jsonStr = match.group(1)!;
        final json = _parseJson(jsonStr);
        if (json != null) {
          return FundInfo(
            code: json['fundcode'] as String? ?? code,
            name: json['name'] as String? ?? '',
            type: '',
            company: '',
            launchDate: json['jzrq'] as String? ?? '',
          );
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /// Get fund NAV history (push2his API)
  Future<List<FundNAV>> getFundNAV(String code) async {
    try {
      final params = {
        'secid': '1.$code',
        'ut': 'fa5fd1943c7b386f172d6893dbfba10b',
        'fields1': 'f1,f2,f3,f4,f5,f6',
        'fields2': 'f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61',
        'klt': '101',
        'fqt': '1',
        'beg': '0',
        'end': '20500101',
        'smplmt': '460',
        'lmt': '0',
      };

      final response = await _dio.get(
        _push2HisUrl,
        queryParameters: params,
        options: Options(
          headers: {
            'Accept': 'application/json',
            'Referer': 'https://fund.eastmoney.com/',
          },
        ),
      );

      final data = response.data as Map<String, dynamic>;
      final klines = data['data']?['klines'] as List<dynamic>?;
      if (klines == null) return [];

      return klines.map((kline) {
        final parts = (kline as String).split(',');
        return FundNAV(
          date: parts.isNotEmpty ? parts[0] : '',
          nav: parts.length > 1 ? double.tryParse(parts[1]) ?? 0 : 0,
          accNav: parts.length > 2 ? double.tryParse(parts[2]) ?? 0 : null,
          changePct:
              parts.length > 6 ? double.tryParse(parts[6]) ?? 0 : 0,
        );
      }).toList();
    } catch (e) {
      return [];
    }
  }

  /// Get fund top 10 holdings (fundf10 API)
  Future<List<FundHolding>> getFundHoldings(String code) async {
    try {
      final response = await _dio.get(
        '$_fundF10Url?type=jjcc&code=$code&topline=10',
        options: Options(
          headers: {
            'Accept': 'text/html',
            'Referer': 'https://fund.eastmoney.com/',
          },
        ),
      );

      final html = response.data as String;
      return _parseHoldingsFromHtml(html);
    } catch (e) {
      return [];
    }
  }

  /// Search funds by keyword
  Future<List<FundInfo>> searchFunds(String keyword) async {
    if (keyword.trim().isEmpty) return [];

    final cleaned = keyword.trim();
    if (RegExp(r'^\d{6}$').hasMatch(cleaned)) {
      final fund = await getFundInfo(cleaned);
      if (fund != null) return [fund];
    }
    return [];
  }

  Map<String, dynamic>? _parseJson(String jsonStr) {
    try {
      // Simple JSON parsing without external dependency
      return _parseJsonObject(jsonStr);
    } catch (e) {
      return null;
    }
  }

  Map<String, dynamic>? _parseJsonObject(String str) {
    str = str.trim();
    if (!str.startsWith('{') || !str.endsWith('}')) return null;

    str = str.substring(1, str.length - 1);
    final result = <String, dynamic>{};
    var i = 0;
    var key = '';
    var inKey = true;
    var inValue = false;
    var currentValue = '';
    var depth = 0;
    var inString = false;

    while (i < str.length) {
      final c = str[i];

      if (c == '"' && (i == 0 || str[i - 1] != '\\')) {
        inString = !inString;
        if (inString && inKey) {
          i++;
          continue;
        }
      }

      if (inString) {
        currentValue += c;
        i++;
        continue;
      }

      if (inKey) {
        if (c == '"') {
          inKey = false;
          inValue = true;
          currentValue = '';
        } else if (c == ':') {
          // start of value
        }
        i++;
        continue;
      }

      if (inValue) {
        if (depth == 0 && (c == '{' || c == '[')) {
          depth++;
          currentValue += c;
        } else if (depth > 0 && (c == '{' || c == '[')) {
          depth++;
          currentValue += c;
        } else if (depth > 0 && (c == '}' || c == ']')) {
          depth--;
          currentValue += c;
        } else if (depth == 0 && c == ',') {
          // end of value
          final colonIdx = currentValue.indexOf(':');
          if (colonIdx > 0) {
            key = currentValue.substring(0, colonIdx).trim();
            var value = currentValue.substring(colonIdx + 1).trim();
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.substring(1, value.length - 1);
            }
            result[key] = value;
          }
          currentValue = '';
          inKey = true;
          inValue = false;
        } else {
          currentValue += c;
        }
        i++;
        continue;
      }

      i++;
    }

    // Process last key-value if exists
    if (currentValue.isNotEmpty) {
      final colonIdx = currentValue.indexOf(':');
      if (colonIdx > 0) {
        key = currentValue.substring(0, colonIdx).trim();
        var value = currentValue.substring(colonIdx + 1).trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        result[key] = value;
      }
    }

    return result.isEmpty ? null : result;
  }

  List<FundHolding> _parseHoldingsFromHtml(String html) {
    final holdings = <FundHolding>[];

    // Look for jjcc data in script
    final scriptPattern = RegExp(r'var\s+jjcc\s*=\s*(\{.*?\});', dotAll: true);
    final scriptMatch = scriptPattern.firstMatch(html);

    if (scriptMatch != null && scriptMatch.group(1) != null) {
      try {
        final rawData = scriptMatch.group(1)!;
        final dataMatch = RegExp(r'\[.*\]', dotAll: true).firstMatch(rawData);
        if (dataMatch != null) {
          final jsonStr = dataMatch.group(0)!;
          // Try to parse holdings array
          final holdingsList = _parseJsonArray(jsonStr);
          if (holdingsList != null) {
            for (var i = 0; i < holdingsList.length && i < 10; i++) {
              final item = holdingsList[i];
              if (item is Map) {
                final name = item['SECUNAME'] as String? ?? '';
                if (name.isNotEmpty) {
                  holdings.add(FundHolding(
                    rank: i + 1,
                    name: name,
                    code: item['SECUCODE'] as String?,
                    proportion:
                        double.tryParse(item['PROPORTION']?.toString() ?? '0') ??
                            0,
                    industry: item['INDUSTRY'] as String?,
                  ));
                }
              }
            }
          }
        }
      } catch (e) {
        // Fall through to empty list
      }
    }

    return holdings;
  }

  List<dynamic>? _parseJsonArray(String str) {
    str = str.trim();
    if (!str.startsWith('[') || !str.endsWith(']')) return null;

    str = str.substring(1, str.length - 1);
    if (str.isEmpty) return [];

    final result = <dynamic>[];
    var current = '';
    var depth = 0;
    var inString = false;
    var i = 0;

    while (i < str.length) {
      final c = str[i];

      if (c == '"' && (i == 0 || str[i - 1] != '\\')) {
        inString = !inString;
        current += c;
        i++;
        continue;
      }

      if (inString) {
        current += c;
        i++;
        continue;
      }

      if (c == '{') {
        depth++;
        current += c;
      } else if (c == '}') {
        depth--;
        current += c;
      } else if (depth == 0 && c == ',') {
        final trimmed = current.trim();
        if (trimmed.startsWith('{')) {
          final obj = _parseJsonObject(trimmed);
          if (obj != null) result.add(obj);
        }
        current = '';
      } else {
        current += c;
      }
      i++;
    }

    // Handle last item
    final trimmed = current.trim();
    if (trimmed.isNotEmpty) {
      if (trimmed.startsWith('{')) {
        final obj = _parseJsonObject(trimmed);
        if (obj != null) result.add(obj);
      }
    }

    return result;
  }
}
