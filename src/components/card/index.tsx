import type { Component } from 'solid-js';
import { Portal } from 'solid-js/web'

export const Card: Component = () => {
  
  return (
      <Portal>
        <div class="absolute inline-block overflow-hidden left-48 top-48 bg-white h-48 w-48 z-0">
          Hello
        </div>
      </Portal>    
  )

}
