import 'dart:js_interop';
import 'package:web/web.dart' as web;

/// Web-specific fetch implementation using JS interop.
/// This bypasses CORS restrictions when running in a browser.
class WebFetch {
  static Future<String> get(String url, {Map<String, String>? headers}) async {
    final jsHeaders = <String, String>{
      'Accept': '*/*',
      'Referer': 'https://fund.eastmoney.com/',
      ...?headers,
    };

    final options = web.RequestInit(
      method: 'GET',
      headers: jsHeaders.jsify() as web.HeadersInit,
    );

    try {
      final response = await web.window.fetch(url.toJS, options).toDart;
      if (response.ok) {
        final text = await response.text().toDart;
        return text.toDart;
      } else {
        throw Exception('HTTP ${response.status}');
      }
    } catch (e) {
      throw Exception('Web fetch failed: $e');
    }
  }
}
