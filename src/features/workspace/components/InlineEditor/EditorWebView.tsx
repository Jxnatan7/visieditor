import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { outboundMessage, type InboundMessage, type OutboundMessage } from '@core/types/editor-bridge';
import { logger } from '@core/logger/logger';

const EDITOR_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: #282A36; overflow: hidden; }
    #editor { width: 100%; height: 100%; }
    .editor-placeholder {
      color: #F8F8F2; font-family: monospace; font-size: 14px;
      padding: 16px; white-space: pre-wrap; word-break: break-all;
      line-height: 22px;
    }
  </style>
</head>
<body>
  <div id="editor"><div class="editor-placeholder" id="content"></div></div>
  <script>
    let currentContent = '';
    let version = 0;
    let debounceTimer = null;

    function notifyChange() {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'CONTENT_CHANGED',
          payload: { content: currentContent, version: ++version }
        }));
      }, 100);
    }

    function applyMessage(msg) {
      const el = document.getElementById('content');
      switch (msg.type) {
        case 'INIT':
          currentContent = msg.payload.content;
          if (el) el.textContent = currentContent;
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'READY' }));
          break;
        case 'SET_CONTENT':
          currentContent = msg.payload.content;
          if (el) el.textContent = currentContent;
          break;
        case 'INSERT_AT_CURSOR':
          currentContent += msg.payload.text;
          if (el) el.textContent = currentContent;
          notifyChange();
          break;
        case 'REPLACE_SELECTION':
          currentContent = msg.payload.text;
          if (el) el.textContent = currentContent;
          notifyChange();
          break;
      }
    }

    document.addEventListener('message', (e) => {
      try { applyMessage(JSON.parse(e.data)); } catch(err) {}
    });
    window.addEventListener('message', (e) => {
      try { applyMessage(JSON.parse(e.data)); } catch(err) {}
    });

    // Make textarea editable
    const content = document.getElementById('content');
    if (content) {
      content.contentEditable = 'true';
      content.addEventListener('input', () => {
        currentContent = content.textContent || '';
        notifyChange();
      });
    }
  </script>
</body>
</html>
`;

export interface EditorWebViewHandle {
  sendMessage: (msg: InboundMessage) => void;
}

interface EditorWebViewProps {
  onMessage?: (msg: OutboundMessage) => void;
  onReady?: () => void;
}

export const EditorWebView = forwardRef<EditorWebViewHandle, EditorWebViewProps>(
  function EditorWebView({ onMessage, onReady }, ref) {
    const webViewRef = useRef<WebView>(null);

    useImperativeHandle(ref, () => ({
      sendMessage: (msg) => {
        webViewRef.current?.injectJavaScript(
          `applyMessage(${JSON.stringify(msg)}); true;`,
        );
      },
    }));

    const handleMessage = useCallback((event: WebViewMessageEvent) => {
      try {
        const raw = JSON.parse(event.nativeEvent.data);
        const parsed = outboundMessage.safeParse(raw);
        if (!parsed.success) return;
        if (parsed.data.type === 'READY') onReady?.();
        onMessage?.(parsed.data);
      } catch (e) {
        logger.error('EditorWebView parse error', e);
      }
    }, [onMessage, onReady]);

    return (
      <WebView
        ref={webViewRef}
        source={{ html: EDITOR_HTML }}
        style={StyleSheet.absoluteFill}
        onMessage={handleMessage}
        originWhitelist={['*']}
        javaScriptEnabled
        scrollEnabled
        keyboardDisplayRequiresUserAction={false}
      />
    );
  },
);
