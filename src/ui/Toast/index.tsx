import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, SafeAreaView, StyleSheet, View } from 'react-native';
import { useTheme } from '@core/design-system/theme-provider';
import { Text } from '../Text';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ show: () => undefined });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { colors, spacing, radii } = useTheme();

  const show = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const bgMap: Record<ToastType, string> = {
    success: colors.accent.success,
    error: colors.accent.danger,
    info: colors.accent.info,
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <View style={styles.container} pointerEvents="none">
        {toasts.map((t) => (
          <View
            key={t.id}
            style={{
              backgroundColor: bgMap[t.type],
              borderRadius: radii.sm,
              padding: spacing[3],
              marginBottom: spacing[2],
              marginHorizontal: spacing[4],
            }}
          >
            <Text variant="caption" style={{ color: '#fff' }}>{t.message}</Text>
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
});
