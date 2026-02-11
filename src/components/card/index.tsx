import type { Component } from 'solid-js';
import { For, Show, createResource } from 'solid-js';
import { Portal } from 'solid-js/web'
import { fetchProfile } from '../../data/profile';
import { iconComponents } from '../icons';

export const Card: Component = () => {
  const [profile] = createResource(fetchProfile);

  const boxStyle = `
    bg-[#eceff4]
    absolute
    inline-block

    left-4
    top-4

    md:left-20
    md:top-20

    lg:left-48
    lg:top-48

    md:w-96

    mt-10
    mx-10

    my-auto
    overflow-visible

    p-8

    rounded-lg
    border-[2.5px]
    border-[#d8dee9]
    z-10
  `;

  return (
      <Portal>
        <Show when={profile()}>
          {(data) => (
            <div class={boxStyle}>
              <h1 class="text-3xl text-[#2e3440]">{data().name}</h1>
              <div class="text-[#2e3440] mt-1">{data().title}</div>
              <div class="text-[#4c566a] mt-2">{data().description}</div>
              <div class="text-[#4c566a] text-sm mt-1">{data().skills}</div>
              <div class="border-t border-[#d8dee9] mt-4 mb-3" />
              <div class="flex items-center gap-3">
                <For each={data().links}>
                  {(link) => {
                    const Icon = iconComponents[link.icon];
                    return (
                      <a
                        href={link.href}
                        aria-label={link.label}
                        class={`
                          relative group
                          text-[#4c566a]/60
                          hover:text-[#81a1c1]
                          transition-all duration-200
                          hover:-translate-y-0.5
                        `}
                      >
                        <Icon />
                        <span class={`
                          absolute left-1/2 -translate-x-1/2 top-full mt-1
                          text-xs text-[#4c566a]
                          bg-[#eceff4] border border-[#d8dee9] rounded px-1.5 py-0.5
                          opacity-0 group-hover:opacity-100
                          transition-opacity duration-200
                          pointer-events-none whitespace-nowrap
                        `}>
                          {link.label}
                        </span>
                      </a>
                    );
                  }}
                </For>
              </div>
            </div>
          )}
        </Show>
      </Portal>
  )
}
