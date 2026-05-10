import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '@core/design-system/theme-provider';
import { EditorWebView, type EditorWebViewHandle } from './EditorWebView';
import { EditorToolbar } from './EditorToolbar';
import type { OutboundMessage } from '@core/types/editor-bridge';
import { detectLanguage } from '../../lib/path-utils';

interface InlineEditorProps {
  path: string;
  initialContent: string;
  onContentChange?: (content: string) => void;
  onSave?: (content: string) => void;
  onAI?: () => void;
  isVisible: boolean;
}

const EDITOR_HEIGHT = 400;

export function InlineEditor({
  path,
  initialContent,
  onContentChange,
  onSave,
  onAI,
  isVisible,
}: InlineEditorProps) {
  const { colors, motion } = useTheme();
  const editorRef = useRef<EditorWebViewHandle>(null);
  const [content, setContent] = useState(initialContent);
  const [isDirty, setIsDirty] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const height = useSharedValue(0);

  useEffect(() => {
    height.value = withTiming(isVisible ? EDITOR_HEIGHT : 0, { duration: motion.base });
  }, [isVisible, motion.base]);

  const handleReady = useCallback(() => {
    setIsReady(true);
    editorRef.current?.sendMessage({
      type: 'INIT',
      payload: {
        content: initialContent,
        language: detectLanguage(path),
        theme: 'dracula',
        fontSize: 14,
        readOnly: false,
      },
    });
  }, [initialContent, path]);

  const handleMessage = useCallback((msg: OutboundMessage) => {
    if (msg.type === 'CONTENT_CHANGED') {
      setContent(msg.payload.content);
      setIsDirty(msg.payload.content !== initialContent);
      onContentChange?.(msg.payload.content);
    }
  }, [initialContent, onContentChange]);

  const handleSave = useCallback(() => {
    onSave?.(content);
    setIsDirty(false);
  }, [content, onSave]);

  const animatedStyle = useAnimatedStyle(() => ({ height: height.value, overflow: 'hidden' }));

  return (
    <Animated.View style={animatedStyle}>
      <View style={{ flex: 1, backgroundColor: colors.bg.base }}>
        <EditorToolbar
          onUndo={() => editorRef.current?.sendMessage({ type: 'UNDO' })}
          onRedo={() => editorRef.current?.sendMessage({ type: 'REDO' })}
          onSave={handleSave}
          onAI={onAI}
          isDirty={isDirty}
        />
        <View style={{ flex: 1 }}>
          <EditorWebView
            ref={editorRef}
            onMessage={handleMessage}
            onReady={handleReady}
          />
        </View>
      </View>
    </Animated.View>
  );
}
