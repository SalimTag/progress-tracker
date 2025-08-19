import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

// Mock viewport dimensions for mobile testing
export const mockMobileViewport = () => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 375,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 667,
  });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

// Mock tablet viewport
export const mockTabletViewport = () => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 768,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 1024,
  });
  
  window.dispatchEvent(new Event('resize'));
};

// Mock desktop viewport
export const mockDesktopViewport = () => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 768,
  });
  
  window.dispatchEvent(new Event('resize'));
};

// Mock touch events
export const mockTouchEvent = (type: 'touchstart' | 'touchend' | 'touchmove', element: Element) => {
  const touchEvent = new Event(type, { bubbles: true });
  Object.defineProperty(touchEvent, 'touches', {
    value: [{
      clientX: 100,
      clientY: 100,
      target: element
    }]
  });
  return touchEvent;
};

// Helper to check if an element meets touch target size requirements (44px minimum)
export const checkTouchTargetSize = (element: Element) => {
  const rect = element.getBoundingClientRect();
  const minSize = 44;
  
  return {
    meetsRequirements: rect.width >= minSize && rect.height >= minSize,
    width: rect.width,
    height: rect.height,
    minSize
  };
};

// Helper to simulate mobile user interactions
export const createMobileUser = () => {
  return userEvent.setup({
    // Simulate slower interactions on mobile
    delay: 50,
  });
};

// Mock Capacitor environment
export const mockCapacitorNative = () => {
  const mockCapacitor = {
    isNativePlatform: vi.fn(() => true),
    getPlatform: vi.fn(() => 'ios'),
  };
  
  vi.doMock('@capacitor/core', () => ({
    Capacitor: mockCapacitor,
  }));
  
  return mockCapacitor;
};

// Mock Capacitor plugins
export const mockCapacitorPlugins = () => {
  const mockHaptics = {
    impact: vi.fn(),
    selectionStart: vi.fn(),
  };
  
  const mockStatusBar = {
    setStyle: vi.fn(),
  };
  
  const mockKeyboard = {
    hide: vi.fn(),
  };
  
  const mockDevice = {
    getInfo: vi.fn(() => Promise.resolve({
      platform: 'ios',
      model: 'iPhone',
      operatingSystem: 'ios',
      osVersion: '15.0',
    })),
  };
  
  vi.doMock('@capacitor/haptics', () => ({
    Haptics: mockHaptics,
    ImpactStyle: {
      Light: 'LIGHT',
      Medium: 'MEDIUM',
      Heavy: 'HEAVY',
    },
  }));
  
  vi.doMock('@capacitor/status-bar', () => ({
    StatusBar: mockStatusBar,
    Style: {
      Dark: 'DARK',
      Light: 'LIGHT',
    },
  }));
  
  vi.doMock('@capacitor/keyboard', () => ({
    Keyboard: mockKeyboard,
  }));
  
  vi.doMock('@capacitor/device', () => ({
    Device: mockDevice,
  }));
  
  return {
    haptics: mockHaptics,
    statusBar: mockStatusBar,
    keyboard: mockKeyboard,
    device: mockDevice,
  };
};

// Test helper to verify safe area support
export const checkSafeAreaSupport = (element: Element) => {
  const styles = window.getComputedStyle(element);
  
  return {
    hasPaddingTop: styles.paddingTop.includes('env(safe-area-inset-top)'),
    hasPaddingBottom: styles.paddingBottom.includes('env(safe-area-inset-bottom)'),
    hasPaddingLeft: styles.paddingLeft.includes('env(safe-area-inset-left)'),
    hasPaddingRight: styles.paddingRight.includes('env(safe-area-inset-right)'),
  };
};
