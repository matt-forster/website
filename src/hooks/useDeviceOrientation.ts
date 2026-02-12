import { createSignal, onMount, onCleanup } from 'solid-js';

export interface DeviceOrientationPosition {
  x: number;
  y: number;
}

/**
 * iOS 13+ extends DeviceOrientationEvent with a requestPermission method
 * that requires user interaction before accessing device orientation data.
 */
interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

interface DeviceOrientationEventConstructor {
  prototype: DeviceOrientationEvent;
  new(): DeviceOrientationEvent;
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

declare const DeviceOrientationEvent: DeviceOrientationEventConstructor;

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
    if (!enabled) {
      return;
    }
    
    if (typeof DeviceOrientationEvent === 'undefined') {
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

      // Mark as active once we receive first orientation event
      if (!isActive()) {
        setIsActive(true);
      }

      // Amplify the device orientation for mobile parallax
      // Mobile devices need more sensitivity since tilting is less precise than mouse movement
      const mobileSensitivity = 3; // Multiplier to amplify the effect
      
      // Normalize beta from [-90, 90] to [0, window.innerHeight] with amplification
      const normalizedBeta = Math.max(-90, Math.min(90, beta));
      const centerY = window.innerHeight / 2;
      const y = centerY + ((normalizedBeta / 90) * centerY * mobileSensitivity);
      
      // Normalize gamma from [-90, 90] to [0, window.innerWidth] with amplification
      const normalizedGamma = Math.max(-90, Math.min(90, gamma));
      const centerX = window.innerWidth / 2;
      const x = centerX + ((normalizedGamma / 90) * centerX * mobileSensitivity);
      
      // Clamp to screen bounds to prevent overflow
      const clampedX = Math.max(0, Math.min(window.innerWidth, x));
      const clampedY = Math.max(0, Math.min(window.innerHeight, y));
      
      setPosition({ x: clampedX, y: clampedY });
    }

    async function requestOrientationPermission() {
      if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
        return;
      }

      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        
        if (permission === 'granted') {
          setPermissionState('granted');
          window.addEventListener('deviceorientation', handleOrientation);
          orientationListenerAdded = true;
        } else {
          setPermissionState('denied');
        }
      } catch (error) {
        setPermissionState('denied');
      }
    }

    // iOS 13+ requires permission via user interaction
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // Add both touchstart and click listeners for better iOS compatibility
      const handleInteraction = async () => {
        await requestOrientationPermission();
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
