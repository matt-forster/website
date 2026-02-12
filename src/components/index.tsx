import type { Component } from 'solid-js';

import { createSignal, onMount, onCleanup } from 'solid-js';
import { ParallaxMountainScene } from './parallaxMountains';
import { Card } from './card';
import { DayNightScene } from './scene/dayNightScene';
import { Birds } from './scene/birds';

export const Main: Component = () => {

  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });

  function handleMouseMove(event: MouseEvent) {
    setMousePosition({
      x: event.clientX,
      y: event.clientY
    })
  }

  // Add device orientation support for mobile tilt-based parallax
  onMount(() => {
    let orientationListenerAdded = false;

    function handleOrientation(event: DeviceOrientationEvent) {
      // DeviceOrientationEvent provides:
      // - beta: front-to-back tilt (range: -180 to 180, typically -90 to 90 when upright)
      // - gamma: left-to-right tilt (range: -90 to 90)
      
      const beta = event.beta; // front-to-back tilt
      const gamma = event.gamma; // left-to-right tilt
      
      if (beta !== null && gamma !== null) {
        // Map device tilt to screen coordinates
        // For beta: 0° is flat, positive is tilting forward, negative is tilting back
        // For gamma: 0° is flat, positive is tilting right, negative is tilting left
        
        // Normalize beta from [-90, 90] to [0, window.innerHeight]
        // Center point is at 0° tilt
        const normalizedBeta = Math.max(-90, Math.min(90, beta)); // Clamp to -90 to 90
        const y = ((normalizedBeta + 90) / 180) * window.innerHeight;
        
        // Normalize gamma from [-90, 90] to [0, window.innerWidth]
        // Center point is at 0° tilt
        const normalizedGamma = Math.max(-90, Math.min(90, gamma)); // Clamp to -90 to 90
        const x = ((normalizedGamma + 90) / 180) * window.innerWidth;
        
        setMousePosition({ x, y });
      }
    }

    async function requestOrientationPermission() {
      // iOS 13+ requires explicit permission for device orientation
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
            orientationListenerAdded = true;
          }
        } catch (error) {
          console.warn('Device orientation permission denied or error:', error);
        }
      }
    }

    function handleFirstTouch() {
      // Request permission on first touch (required for iOS 13+)
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        requestOrientationPermission();
      }
    }

    // Check if device orientation is supported
    if (typeof DeviceOrientationEvent !== 'undefined') {
      // iOS 13+ requires permission via user interaction
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        // Wait for user interaction before requesting permission
        // The 'once: true' option automatically removes the listener after first execution
        window.addEventListener('touchstart', handleFirstTouch, { once: true });
      } else {
        // Non-iOS or older iOS - just add the listener directly
        window.addEventListener('deviceorientation', handleOrientation);
        orientationListenerAdded = true;
      }
    }

    onCleanup(() => {
      // Only remove the orientation listener if it was actually added
      if (orientationListenerAdded) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
      // Note: touchstart listener with 'once: true' is automatically removed after first use
    });
  });

  return (
    <DayNightScene>
      <div class="min-h-[100svh]" onMouseMove={handleMouseMove}>
        <Card />
        <Birds />
        <ParallaxMountainScene position={mousePosition()} />
      </div>
    </DayNightScene>
  )
}
