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

  onMount(() => {
    if (!enabled || typeof DeviceOrientationEvent === 'undefined') {
      return;
    }

    let orientationListenerAdded = false;
    let touchListenerAdded = false;

    function handleOrientation(event: DeviceOrientationEvent) {
      const beta = event.beta;
      const gamma = event.gamma;
      
      if (beta === null || gamma === null) {
        return;
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
        return;
      }

      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        
        if (permission === 'granted') {
          setPermissionState('granted');
          window.addEventListener('deviceorientation', handleOrientation);
          orientationListenerAdded = true;
        } else {
          setPermissionState('denied');
          console.warn('Device orientation permission denied');
        }
      } catch (error) {
        setPermissionState('denied');
        console.warn('Device orientation permission error:', error);
      }
    }

    function handleFirstTouch() {
      touchListenerAdded = false;
      requestOrientationPermission();
    }

    // iOS 13+ requires permission via user interaction
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      // Add both touchstart and click listeners for better iOS compatibility
      const handleInteraction = () => {
        if (touchListenerAdded) {
          touchListenerAdded = false;
          window.removeEventListener('touchstart', handleInteraction);
          window.removeEventListener('click', handleInteraction);
        }
        requestOrientationPermission();
      };

      window.addEventListener('touchstart', handleInteraction, { once: true, passive: true });
      window.addEventListener('click', handleInteraction, { once: true });
      touchListenerAdded = true;
    } else {
      // Non-iOS or older iOS - add listener directly
      window.addEventListener('deviceorientation', handleOrientation);
      orientationListenerAdded = true;
      setPermissionState('granted');
    }

    onCleanup(() => {
      if (orientationListenerAdded) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
      if (touchListenerAdded) {
        window.removeEventListener('touchstart', handleFirstTouch);
      }
    });
  });

  return {
    position,
    permissionState,
  };
}
