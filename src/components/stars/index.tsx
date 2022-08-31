import type { Component } from 'solid-js';
import { Portal } from 'solid-js/web'


export const Stars: Component = () => {

  const boxStyle = `
    invisible
    xl:visible

    bg-white
    absolute

    overflow-hidden
    inline-block

    left-1/2
    top-48

    h-96
    w-auto
    mt-10
    mx-10

    my-auto

    p-8

    shadow-md
    rounded-lg
    z-10
  `;

  const starList = `
    flex
    flex-col

    h-72
    pt-4
    text-sm

    overflow-scroll
  `;

  const starStyle = `
    mb-10
    pl-1
    font-medium
  `;

  return (
      <Portal>
        <div class={boxStyle}>
          <h1 class="text-4xl">Recently interested in:</h1>
          <hr class="m-4"></hr>
          <div class={starList}>
            <span class={starStyle}>Star 1</span>
            <span class={starStyle}>Star 2</span>
            <span class={starStyle}>Star 3</span>
            <span class={starStyle}>Star 4</span>
            <span class={starStyle}>Star 5</span>
            <span class={starStyle}>Star 6</span>
            <span class={starStyle}>Star 7</span>
            <span class={starStyle}>Star 8</span>
            <span class={starStyle}>Star 9</span>
            <span class={starStyle}>Star 10</span>
          </div>
        </div>
      </Portal>
  )
}
