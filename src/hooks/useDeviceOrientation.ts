import { createSignal, onMount, onCleanup } from 'solid-js';

export interface DeviceOrientationPosition {
  x: number;
  y: number;
}

/**
 * Custom hook for device orientation-based parallax control.
 * Maps device tilt (beta/gamma angles) to screen coordinates.
 * 
 * @param enabled - Whether device orientation should be enabled
 * @returns A signal with the current position based on device tilt
 */
export function useDeviceOrientation(enabled: boolean = true) {
  const [position, setPosition] = createSignal<DeviceOrientationPosition>({ x: 0, y: 0 });
  const [permissionState, setPermissionState] = createSignal<'prompt' | 'granted' | 'denied'>('prompt');
  const [isActive, setIsActive] = createSignal(false);

  onMount(() => {
    console.log('[DeviceOrientation] Hook mounted, enabled:', enabled);
    
    if (!enabled) {
      console.log('[DeviceOrientation] Hook disabled via prop');
      return;
    }
    
    if (typeof DeviceOrientationEvent === 'undefined') {
      console.log('[DeviceOrientation] DeviceOrientationEvent not supported');
      return;
    }

    let orientationListenerAdded = false;
    let touchListenerAdded = false;

    function handleOrientation(event: DeviceOrientationEvent) {
      const beta = event.beta;
      const gamma = event.gamma;
      
      if (beta === null || gamma === null) {
        console.log('[DeviceOrientation] Received event with null values:', { beta, gamma });
        return;
      }

      // Mark as active once we receive first orientation event
      if (!isActive()) {
        console.log('[DeviceOrientation] First orientation event received:', { beta, gamma });
        setIsActive(true);
      }

      // Normalize beta from [-90, 90] to [0, window.innerHeight]
      const normalizedBeta = Math.max(-90, Math.min(90, beta));
      const y = ((normalizedBeta + 90) / 180) * window.innerHeight;
      
      // Normalize gamma from [-90, 90] to [0, window.innerWidth]
      const normalizedGamma = Math.max(-90, Math.min(90, gamma));
      const x = ((normalizedGamma + 90) / 180) * window.innerWidth;
      
      setPosition({ x, y });
    }

    async function requestOrientationPermission() {
      if (typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
        console.log('[DeviceOrientation] No permission request needed (non-iOS or older iOS)');
        return;
      }

      try {
        console.log('[DeviceOrientation] Requesting permission...');
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        console.log('[DeviceOrientation] Permission result:', permission);
        
        if (permission === 'granted') {
          setPermissionState('granted');
          window.addEventListener('deviceorientation', handleOrientation);
          orientationListenerAdded = true;
          console.log('[DeviceOrientation] Permission granted, listener added');
        } else {
          setPermissionState('denied');
          console.warn('[DeviceOrientation] Permission denied by user');
        }
      } catch (error) {
        setPermissionState('denied');
        console.error('[DeviceOrientation] Permission request error:', error);
      }
    }

    // iOS 13+ requires permission via user interaction
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      console.log('[DeviceOrientation] iOS 13+ detected, waiting for user interaction');
      
      // Add both touchstart and click listeners for better iOS compatibility
      const handleInteraction = async () => {
        console.log('[DeviceOrientation] User interaction detected, requesting permission');
        await requestOrientationPermission();
      };

      window.addEventListener('touchstart', handleInteraction, { once: true, passive: true });
      window.addEventListener('click', handleInteraction, { once: true });
      touchListenerAdded = true;
    } else {
      // Non-iOS or older iOS - add listener directly
      console.log('[DeviceOrientation] Non-iOS detected, adding listener directly');
      window.addEventListener('deviceorientation', handleOrientation);
      orientationListenerAdded = true;
      setPermissionState('granted');
    }

    onCleanup(() => {
      if (orientationListenerAdded) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
      // Note: Event listeners with 'once: true' are automatically removed after first use
      // so we don't need to manually clean them up
    });
  });

  return {
    position,
    permissionState,
    isActive,
  };
}
