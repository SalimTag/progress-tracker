import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { Device } from '@capacitor/device';

interface DeviceInfo {
  platform: string;
  operatingSystem: string;
  model: string;
  isVirtual: boolean;
}

export const useNativeFeatures = () => {
  const [isNative, setIsNative] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    const checkPlatform = async () => {
      const native = Capacitor.isNativePlatform();
      setIsNative(native);

      if (native) {
        try {
          // Get device information
          const info = await Device.getInfo();
          setDeviceInfo(info);

          // Configure status bar for mobile
          if (Capacitor.getPlatform() === 'ios') {
            await StatusBar.setStyle({ style: Style.Dark });
          }
        } catch (error) {
          console.warn('Native features setup failed:', error);
        }
      }
    };

    checkPlatform();
  }, []);

  const hapticImpact = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (!isNative) return;
    
    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  };

  const hapticSelection = async () => {
    if (!isNative) return;
    
    try {
      await Haptics.selectionStart();
    } catch (error) {
      console.warn('Haptic selection failed:', error);
    }
  };

  const hideKeyboard = async () => {
    if (!isNative) return;
    
    try {
      await Keyboard.hide();
    } catch (error) {
      console.warn('Hide keyboard failed:', error);
    }
  };

  const setStatusBarStyle = async (style: Style) => {
    if (!isNative) return;
    
    try {
      await StatusBar.setStyle({ style });
    } catch (error) {
      console.warn('Status bar style failed:', error);
    }
  };

  return {
    isNative,
    deviceInfo,
    hapticImpact,
    hapticSelection,
    hideKeyboard,
    setStatusBarStyle,
    platform: Capacitor.getPlatform(),
  };
};

export { ImpactStyle, Style };
