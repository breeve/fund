import 'dart:io';
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as shelf_io;

/// Local proxy server that adds CORS headers to external API requests.
/// This solves CORS issues when running on web/desktop platforms.
class LocalProxyServer {
  static final LocalProxyServer _instance = LocalProxyServer._internal();
  factory LocalProxyServer() => _instance;
  LocalProxyServer._internal();

  HttpServer? _server;
  int? _port;
  bool _isRunning = false;

  int? get port => _port;
  bool get isRunning => _isRunning;

  /// Start the proxy server on an available port.
  /// Returns the port number if successful, null otherwise.
  Future<int?> start() async {
    if (_isRunning) return _port;

    try {
      final handler = Pipeline()
          .addMiddleware(_corsMiddleware())
          .addHandler(_proxyHandler);

      _server = await shelf_io.serve(
        handler,
        InternetAddress.loopbackIPv4,
        0,
      );
      _port = _server!.port;
      _isRunning = true;
      return _port;
    } catch (e) {
      _server = null;
      _isRunning = false;
      return null;
    }
  }

  /// Stop the proxy server.
  Future<void> stop() async {
    if (_server != null) {
      await _server!.close(force: true);
      _server = null;
      _port = null;
      _isRunning = false;
    }
  }

  /// Get the base URL for the proxy server.
  String get baseUrl {
    if (_port == null) return '';
    return 'http://localhost:$_port';
  }

  /// CORS middleware that adds appropriate headers.
  Middleware _corsMiddleware() {
    return (Handler innerHandler) {
      return (Request request) async {
        if (request.method == 'OPTIONS') {
          return Response.ok('', headers: _corsHeaders);
        }

        final response = await innerHandler(request);
        return response.change(headers: _corsHeaders);
      };
    };
  }

  static const Map<String, String> _corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Referer',
  };

  Handler get _proxyHandler => (Request request) async {
    final path = request.url.path;
    String targetUrl;

    if (path.startsWith('fundgz/')) {
      // Fund info: https://fundgz.1234567.com.cn/{code}.js
      targetUrl = 'https://fundgz.1234567.com.cn/$path';
    } else if (path.startsWith('fundf10nav/')) {
      // NAV history: https://fundf10.eastmoney.com/F10DataApi.aspx?...
      final subPath = path.substring('fundf10nav/'.length);
      targetUrl = 'https://fundf10.eastmoney.com/$subPath';
    } else if (path.startsWith('fundholdings/')) {
      // Holdings: https://fundf10.eastmoney.com/FundArchivesDatas.aspx?...
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
        headers: _corsHeaders,
      );
    }
  };

  Future<Response> _forwardRequest(Request request, String targetUrl) async {
    final headers = <String, String>{};
    request.headers.forEach((key, value) {
      if (key.toLowerCase() != 'host' && key.toLowerCase() != 'content-length') {
        headers[key] = value;
      }
    });

    // Required headers for eastmoney APIs
    headers['Referer'] = 'https://fund.eastmoney.com/';
    headers['Accept'] = '*/*';

    final ioClient = HttpClient();
    try {
      final ioRequest = await ioClient.openUrl(request.method, Uri.parse(targetUrl));
      headers.forEach(ioRequest.headers.set);

      final bodyBytes = await request.read().expand((e) => e).toList();
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
        headers: {
          ...responseHeaders,
          ..._corsHeaders,
        },
      );
    } finally {
      ioClient.close();
    }
  }
}
