#!/usr/bin/env dart
// Backend server for Fund Diagnosis API.
// Provides REST API endpoints and proxies requests to data sources.
//
// Usage:
//   dart run bin/server.dart                    # Default port 8081
//   dart run bin/server.dart 9000              # Custom port
//
// For Flutter Web development:
//   1. Start this server: dart run bin/server.dart
//   2. In another terminal: flutter run -d chrome
//   3. App will connect to http://localhost:8081

import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as shelf_io;

const int defaultPort = 8081;
const String defaultHost = 'localhost';

const Map<String, String> corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
  'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization, Referer',
};

const Map<String, dynamic> availableDataSources = {
  'sources': [
    {
      'id': 'eastmoney',
      'name': '东方财富 (EastMoney)',
      'description': 'Primary data source - 东方财富网',
      'endpoints': {
        'fundInfo': 'https://fundgz.1234567.com.cn/js',
        'fundNAV': 'https://fundf10.eastmoney.com/F10DataApi.aspx',
        'fundHoldings': 'https://fundf10.eastmoney.com/FundArchivesDatas.aspx',
      },
      'enabled': true,
    },
    {
      'id': 'eastmoney_f10',
      'name': '东方财富 F10 (EastMoney F10)',
      'description': 'Alternative F10 data interface',
      'endpoints': {
        'fundInfo': 'https://fundf10.eastmoney.com/QuoteManagement.aspx',
        'fundNAV': 'https://fundf10.eastmoney.com/F10DataApi.aspx',
        'fundHoldings': 'https://fundf10.eastmoney.com/FundArchivesDatas.aspx',
      },
      'enabled': true,
    },
  ],
  'default': 'eastmoney',
};

// In-memory config (in production, persist to file/database)
Map<String, dynamic> _serverConfig = {
  'dataSource': 'eastmoney',
  'logLevel': 'info',
};

/// Main server initialization
Future<HttpServer> startServer({
  int? port,
  String host = defaultHost,
}) async {
  final actualPort = port ?? int.tryParse(Platform.environment['PORT'] ?? '') ?? defaultPort;

  final handler = Pipeline()
      .addMiddleware(corsMiddleware)
      .addMiddleware(logMiddleware)
      .addHandler(router);

  final server = await shelf_io.serve(handler, InternetAddress.loopbackIPv4, actualPort);

  print('');
  print('╔═══════════════════════════════════════════════════════════════╗');
  print('║           Fund Diagnosis Backend Server                       ║');
  print('╠═══════════════════════════════════════════════════════════════╣');
  print('║  Server running on http://$host:${server.port}                     ║');
  print('╠═══════════════════════════════════════════════════════════════╣');
  print('║  REST API Endpoints:                                        ║');
  print('║    GET  /api/datasources          - List data sources       ║');
  print('║    GET  /api/config               - Get current config       ║');
  print('║    POST /api/config               - Update config            ║');
  print('║    GET  /api/fund/search?q=       - Search funds             ║');
  print('║    GET  /api/fund/:code/info      - Get fund info            ║');
  print('║    GET  /api/fund/:code/nav       - Get NAV history         ║');
  print('║    GET  /api/fund/:code/holdings  - Get fund holdings       ║');
  print('║    GET  /health                   - Health check             ║');
  print('╠═══════════════════════════════════════════════════════════════╣');
  print('║  Legacy Proxy Endpoints (backward compatible):              ║');
  print('║    /fundgz/:code.js               - Fund info proxy         ║');
  print('║    /fundf10nav/...                - NAV history proxy       ║');
  print('║    /fundholdings/...              - Holdings proxy           ║');
  print('╠═══════════════════════════════════════════════════════════════╣');
  print('║  Press Ctrl+C to stop.                                      ║');
  print('╚═══════════════════════════════════════════════════════════════╝');
  print('');

  return server;
}

void main(List<String> args) async {
  final port = args.isNotEmpty ? int.tryParse(args[0]) : null;
  await startServer(port: port);
}

// ─────────────────────────────────────────────────────────────────
// Router
// ─────────────────────────────────────────────────────────────────

Handler get router => (Request request) async {
  final path = request.url.path;

  // API routes
  if (path == 'api/datasources' || path.startsWith('api/datasources/')) {
    return handleDataSources(request);
  }
  if (path == 'api/config') {
    return handleConfig(request);
  }
  if (path == 'api/fund/search') {
    return handleFundSearch(request);
  }
  if (path == 'health') {
    return handleHealth(request);
  }

  // Fund API routes
  final fundMatch = RegExp(r'^api/fund/(\w+)/(\w+)$').firstMatch(path);
  if (fundMatch != null) {
    final code = fundMatch.group(1)!;
    final endpoint = fundMatch.group(2)!;
    return handleFundEndpoint(request, code, endpoint);
  }

  // Legacy proxy routes (backward compatible)
  if (path.startsWith('fundgz/') ||
      path.startsWith('fundf10nav/') ||
      path.startsWith('fundholdings/')) {
    return handleProxy(request, path);
  }

  return Response.notFound(
    jsonEncode({'error': 'Not found', 'path': path}),
    headers: {'Content-Type': 'application/json'},
  );
};

// ─────────────────────────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────────────────────────

Response handleHealth(Request request) {
  return Response.ok(
    jsonEncode({
      'status': 'ok',
      'timestamp': DateTime.now().toIso8601String(),
      'version': '1.0.0',
      'config': _serverConfig['dataSource'],
    }),
    headers: {'Content-Type': 'application/json'},
  );
}

// ─────────────────────────────────────────────────────────────────
// Data Sources API
// ─────────────────────────────────────────────────────────────────

Response handleDataSources(Request request) {
  if (request.method == 'GET') {
    return Response.ok(
      jsonEncode(availableDataSources),
      headers: {'Content-Type': 'application/json'},
    );
  }

  return Response(
    HttpStatus.methodNotAllowed,
    body: jsonEncode({'error': 'Method not allowed'}),
    headers: {'Content-Type': 'application/json'},
  );
}

// ─────────────────────────────────────────────────────────────────
// Config API
// ─────────────────────────────────────────────────────────────────

Future<Response> handleConfig(Request request) async {
  if (request.method == 'GET') {
    return Response.ok(
      jsonEncode({
        'dataSource': _serverConfig['dataSource'],
        'logLevel': _serverConfig['logLevel'],
      }),
      headers: {'Content-Type': 'application/json'},
    );
  }

  if (request.method == 'POST') {
    final bodyBytes = await request.read().fold<List<int>>([], (prev, elem) => prev..addAll(elem));
    final body = utf8.decode(bodyBytes);

    try {
      final data = jsonDecode(body) as Map<String, dynamic>;

      if (data.containsKey('dataSource')) {
        _serverConfig['dataSource'] = data['dataSource'] as String;
      }
      if (data.containsKey('logLevel')) {
        _serverConfig['logLevel'] = data['logLevel'] as String;
      }

      return Response.ok(
        jsonEncode({
          'success': true,
          'config': _serverConfig,
        }),
        headers: {'Content-Type': 'application/json'},
      );
    } catch (e) {
      return Response.badRequest(
        body: jsonEncode({'error': 'Invalid JSON: $e'}),
        headers: {'Content-Type': 'application/json'},
      );
    }
  }

  return Response(
    HttpStatus.methodNotAllowed,
    body: jsonEncode({'error': 'Method not allowed'}),
    headers: {'Content-Type': 'application/json'},
  );
}

// ─────────────────────────────────────────────────────────────────
// Fund Search API
// ─────────────────────────────────────────────────────────────────

Future<Response> handleFundSearch(Request request) async {
  final query = request.url.queryParameters['q'] ??
                request.url.queryParameters['query'] ??
                request.url.queryParameters['keyword'] ?? '';

  if (query.isEmpty) {
    return Response.ok(
      jsonEncode({'funds': [], 'query': query}),
      headers: {'Content-Type': 'application/json'},
    );
  }

  // Only support 6-digit fund code search for now
  if (!RegExp(r'^\d{6}$').hasMatch(query)) {
    return Response.ok(
      jsonEncode({
        'funds': [],
        'query': query,
        'message': 'Please enter a 6-digit fund code',
      }),
      headers: {'Content-Type': 'application/json'},
    );
  }

  try {
    final fundInfo = await fetchFundInfo(query);
    if (fundInfo != null) {
      return Response.ok(
        jsonEncode({
          'funds': [fundInfo],
          'query': query,
        }),
        headers: {'Content-Type': 'application/json'},
      );
    } else {
      return Response.ok(
        jsonEncode({
          'funds': [],
          'query': query,
          'message': 'Fund not found',
        }),
        headers: {'Content-Type': 'application/json'},
      );
    }
  } catch (e) {
    return Response.internalServerError(
      body: jsonEncode({
        'error': 'Failed to search fund',
        'message': e.toString(),
      }),
      headers: {'Content-Type': 'application/json'},
    );
  }
}

// ─────────────────────────────────────────────────────────────────
// Fund Endpoints API
// ─────────────────────────────────────────────────────────────────

Future<Response> handleFundEndpoint(Request request, String code, String endpoint) async {
  switch (endpoint) {
    case 'info':
      return handleFundInfo(request, code);
    case 'nav':
      return handleFundNAV(request, code);
    case 'holdings':
      return handleFundHoldings(request, code);
    default:
      return Response.notFound(
        jsonEncode({'error': 'Unknown endpoint: $endpoint'}),
        headers: {'Content-Type': 'application/json'},
      );
  }
}

Future<Response> handleFundInfo(Request request, String code) async {
  try {
    final fundInfo = await fetchFundInfo(code);
    if (fundInfo != null) {
      return Response.ok(
        jsonEncode(fundInfo),
        headers: {'Content-Type': 'application/json'},
      );
    } else {
      return Response.notFound(
        jsonEncode({'error': 'Fund not found', 'code': code}),
        headers: {'Content-Type': 'application/json'},
      );
    }
  } catch (e) {
    return Response.internalServerError(
      body: jsonEncode({'error': 'Failed to get fund info', 'message': e.toString()}),
      headers: {'Content-Type': 'application/json'},
    );
  }
}

Future<Response> handleFundNAV(Request request, String code) async {
  try {
    final navList = await fetchFundNAV(code);
    return Response.ok(
      jsonEncode({'code': code, 'navHistory': navList}),
      headers: {'Content-Type': 'application/json'},
    );
  } catch (e) {
    return Response.internalServerError(
      body: jsonEncode({'error': 'Failed to get NAV history', 'message': e.toString()}),
      headers: {'Content-Type': 'application/json'},
    );
  }
}

Future<Response> handleFundHoldings(Request request, String code) async {
  try {
    final holdings = await fetchFundHoldings(code);
    return Response.ok(
      jsonEncode({'code': code, 'holdings': holdings}),
      headers: {'Content-Type': 'application/json'},
    );
  } catch (e) {
    return Response.internalServerError(
      body: jsonEncode({'error': 'Failed to get fund holdings', 'message': e.toString()}),
      headers: {'Content-Type': 'application/json'},
    );
  }
}

// ─────────────────────────────────────────────────────────────────
// Data Fetching (proxy to external APIs)
// ─────────────────────────────────────────────────────────────────

Future<Map<String, dynamic>?> fetchFundInfo(String code) async {
  final url = 'https://fundgz.1234567.com.cn/js/$code.js';

  final client = HttpClient();
  try {
    final request = await client.openUrl('GET', Uri.parse(url));
    request.headers.set('Referer', 'https://fund.eastmoney.com/');
    request.headers.set('Accept', '*/*');
    request.headers.set('Accept-Language', 'zh-CN,zh;q=0.9,en;q=0.8');
    request.headers.set('Accept-Charset', 'utf-8');

    final response = await request.close();
    final body = await response.fold<List<int>>([], (prev, elem) => prev..addAll(elem));

    // EastMoney returns GBK/GB2312 encoded response
    // Convert GBK bytes to String by going through UTF-8 interpretation
    // Since GBK is not valid UTF-8, we need a different approach
    // The JSON part (ASCII) works fine, Chinese chars get handled by proper decoding
    String text;
    try {
      text = utf8.decode(body);
    } catch (e) {
      // GBK/GB2312 fallback - latin1 preserves ASCII parts correctly
      text = latin1.decode(body);
    }

    // Parse JSONP response: jsonpgz({...})
    final match = RegExp(r'jsonpgz\((.*)\)').firstMatch(text);
    if (match != null && match.group(1) != null) {
      try {
        final json = jsonDecode(match.group(1)!) as Map<String, dynamic>;
        return {
          'code': json['fundcode'] ?? code,
          'name': json['name'] ?? '',
          'type': '',
          'company': '',
          'launchDate': json['jzrq'] ?? '',
        };
      } catch (e) {
        print('[ERROR] JSON parse error: $e');
      }
    }
    return null;
  } finally {
    client.close();
  }
}

Future<List<Map<String, dynamic>>> fetchFundNAV(String code) async {
  final url = 'https://fundf10.eastmoney.com/F10DataApi.aspx?type=lsjz&code=$code&page=1&per=200';

  final client = HttpClient();
  try {
    final request = await client.openUrl('GET', Uri.parse(url));
    request.headers.set('Referer', 'https://fund.eastmoney.com/');
    request.headers.set('Accept', '*/*');

    final response = await request.close();
    final bodyBytes = await response.fold<List<int>>([], (prev, elem) => prev..addAll(elem));
    final text = utf8.decode(bodyBytes);

    return _parseNavFromText(text);
  } finally {
    client.close();
  }
}

Future<List<Map<String, dynamic>>> fetchFundHoldings(String code) async {
  final url = 'https://fundf10.eastmoney.com/FundArchivesDatas.aspx?code=$code&topline=10&type=jjcc';

  final client = HttpClient();
  try {
    final request = await client.openUrl('GET', Uri.parse(url));
    request.headers.set('Referer', 'https://fund.eastmoney.com/');
    request.headers.set('Accept', '*/*');

    final response = await request.close();
    final bodyBytes = await response.fold<List<int>>([], (prev, elem) => prev..addAll(elem));
    final text = utf8.decode(bodyBytes);

    return _parseHoldingsFromText(text);
  } finally {
    client.close();
  }
}

// ─────────────────────────────────────────────────────────────────
// HTML Parsing Helpers
// ─────────────────────────────────────────────────────────────────

List<Map<String, dynamic>> _parseNavFromText(String text) {
  final navList = <Map<String, dynamic>>[];
  final contentMatch = RegExp(r'content:"([^"]*)"').firstMatch(text);
  if (contentMatch == null) return [];
  final content = contentMatch.group(1) ?? '';
  if (content.isEmpty) return [];

  final rowPattern = RegExp(r'<tr[^>]*>(.*?)</tr>', dotAll: true);
  final cellPattern = RegExp(r'<td[^>]*>(.*?)</td>', dotAll: true);

  for (final rowMatch in rowPattern.allMatches(content)) {
    final rowHtml = rowMatch.group(1) ?? '';
    if (rowHtml.contains('净值日期')) continue;

    final cells = <String>[];
    for (final cellMatch in cellPattern.allMatches(rowHtml)) {
      final cellHtml = cellMatch.group(1) ?? '';
      final cellText = cellHtml.replaceAll(RegExp(r'<[^>]*>'), '').trim();
      cells.add(cellText);
    }

    if (cells.length >= 3) {
      final date = cells[0];
      final navText = cells[1].replaceAll(RegExp(r'[^\d.]'), '');
      final accNavText = cells[2].replaceAll(RegExp(r'[^\d.]'), '');
      final changeText = cells.length > 3 ? cells[3].replaceAll(RegExp(r'[^\d.-]'), '') : '0';

      final nav = double.tryParse(navText) ?? 0;
      final accNav = accNavText.isNotEmpty ? double.tryParse(accNavText) : null;
      final changePct = double.tryParse(changeText) ?? 0;

      navList.add({
        'date': date,
        'nav': nav,
        'accNav': accNav,
        'changePct': changePct,
      });
    }
  }

  return navList;
}

List<Map<String, dynamic>> _parseHoldingsFromText(String text) {
  final holdings = <Map<String, dynamic>>[];
  final contentMatch = RegExp(r'content:"([^"]*)"').firstMatch(text);
  if (contentMatch == null) return [];
  final content = contentMatch.group(1) ?? '';
  if (content.isEmpty) return [];

  final rowPattern = RegExp(r'<tr[^>]*>(.*?)</tr>', dotAll: true);
  final cellPattern = RegExp(r'<td[^>]*>(.*?)</td>', dotAll: true);

  for (final rowMatch in rowPattern.allMatches(content)) {
    final rowHtml = rowMatch.group(1) ?? '';
    if (rowHtml.contains('序号') || rowHtml.contains('股票代码')) continue;

    final cells = <String>[];
    for (final cellMatch in cellPattern.allMatches(rowHtml)) {
      final cellHtml = cellMatch.group(1) ?? '';
      final cellText = cellHtml.replaceAll(RegExp(r'<[^>]*>'), '').replaceAll(RegExp(r'\s+'), ' ').trim();
      cells.add(cellText);
    }

    if (cells.length >= 4) {
      final stockName = cells[2].trim();
      if (stockName.isEmpty || stockName == '股票名称') continue;

      final proportionText = cells.length > 6 ? cells[6].replaceAll(RegExp(r'[^\d.]'), '') : '0';
      final proportion = double.tryParse(proportionText) ?? 0;

      holdings.add({
        'rank': holdings.length + 1,
        'name': stockName,
        'proportion': proportion,
      });
    }
  }

  return holdings;
}

// ─────────────────────────────────────────────────────────────────
// JSON Parser (handles JSONP responses)
// ─────────────────────────────────────────────────────────────────

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
      if (inString && inKey) { i++; continue; }
    }
    if (inString) { currentValue += c; i++; continue; }
    if (inKey) {
      if (c == '"') { inKey = false; inValue = true; currentValue = ''; }
      else if (c == ':') {}
      i++; continue;
    }
    if (inValue) {
      if (depth == 0 && (c == '{' || c == '[')) { depth++; currentValue += c; }
      else if (depth > 0 && (c == '{' || c == '[')) { depth++; currentValue += c; }
      else if (depth > 0 && (c == '}' || c == ']')) { depth--; currentValue += c; }
      else if (depth == 0 && c == ',') {
        final colonIdx = currentValue.indexOf(':');
        if (colonIdx > 0) {
          key = currentValue.substring(0, colonIdx).trim();
          var value = currentValue.substring(colonIdx + 1).trim();
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
          }
          result[key] = value;
        }
        currentValue = ''; inKey = true; inValue = false;
      } else { currentValue += c; }
      i++; continue;
    }
    i++;
  }

  // Handle last key-value pair
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

// ─────────────────────────────────────────────────────────────────
// Legacy Proxy Handler (backward compatible)
// ─────────────────────────────────────────────────────────────────

Future<Response> handleProxy(Request request, String path) async {
  String targetUrl;

  if (path.startsWith('fundgz/')) {
    targetUrl = 'https://fundgz.1234567.com.cn/${path.substring('fundgz/'.length)}';
  } else if (path.startsWith('fundf10nav/')) {
    final subPath = path.substring('fundf10nav/'.length);
    targetUrl = 'https://fundf10.eastmoney.com/$subPath';
  } else if (path.startsWith('fundholdings/')) {
    final subPath = path.substring('fundholdings/'.length);
    targetUrl = 'https://fundf10.eastmoney.com/$subPath';
  } else {
    return Response.notFound('Not found: $path');
  }

  final queryString = request.url.query;
  if (queryString.isNotEmpty) {
    targetUrl = '$targetUrl?$queryString';
  }

  try {
    return await _forwardRequest(request, targetUrl);
  } catch (e) {
    return Response.internalServerError(
      body: 'Proxy error: $e',
      headers: corsHeaders,
    );
  }
}

Future<Response> _forwardRequest(Request request, String targetUrl) async {
  final headers = <String, String>{};
  request.headers.forEach((key, value) {
    if (key.toLowerCase() != 'host' && key.toLowerCase() != 'content-length') {
      headers[key] = value;
    }
  });

  headers['Referer'] = 'https://fund.eastmoney.com/';
  headers['Accept'] = '*/*';

  final client = HttpClient();
  try {
    final ioRequest = await client.openUrl(request.method, Uri.parse(targetUrl));
    ioRequest.headers.set('Referer', 'https://fund.eastmoney.com/');
    ioRequest.headers.set('Accept', '*/*');

    final bodyBytes = await request.read().fold<List<int>>([], (prev, elem) => prev..addAll(elem));
    if (bodyBytes.isNotEmpty) {
      ioRequest.add(bodyBytes);
    }

    final ioResponse = await ioRequest.close();
    final responseBody = await ioResponse.fold<List<int>>(
      [],
      (prev, element) => prev..addAll(element),
    );

    final responseHeaders = <String, String>{};
    ioResponse.headers.forEach((key, values) {
      responseHeaders[key] = values.join(', ');
    });

    return Response(
      ioResponse.statusCode,
      body: responseBody,
      headers: {...responseHeaders, ...corsHeaders},
    );
  } finally {
    client.close();
  }
}

// ─────────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────────

Middleware get corsMiddleware {
  return (Handler innerHandler) {
    return (Request request) async {
      if (request.method == 'OPTIONS') {
        return Response.ok('', headers: corsHeaders);
      }
      final response = await innerHandler(request);
      return response.change(headers: corsHeaders);
    };
  };
}

Middleware get logMiddleware {
  return (Handler innerHandler) {
    return (Request request) async {
      final start = DateTime.now();
      final response = await innerHandler(request);
      final duration = DateTime.now().difference(start);

      final color = switch (response.statusCode) {
        >= 200 && < 300 => '\x1b[32m',  // Green
        >= 300 && < 400 => '\x1b[33m',  // Yellow
        >= 400 && < 500 => '\x1b[31m',  // Red
        _ => '\x1b[35m',                 // Magenta
      };

      print('$color[${request.method}]${response.statusCode == 200 ? '' : ' ${response.statusCode}'}\x1b[0m '
            '${request.url.path}${request.url.query.isNotEmpty ? '?${request.url.query}' : ''} '
            '(\x1b[2m${duration.inMilliseconds}ms\x1b[0m)');

      return response;
    };
  };
}
