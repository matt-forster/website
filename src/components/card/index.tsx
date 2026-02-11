import type { Component } from 'solid-js';
import { For, Show, createResource } from 'solid-js';
import { Portal } from 'solid-js/web'
import { fetchProfile } from '../../data/profile';
import { iconComponents } from '../icons';
import { useTheme } from '../../context/theme';

export const Card: Component = () => {
  const [profile] = createResource(fetchProfile);
  const { mode } = useTheme();

  const boxStyle = `
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
    z-10

    transition-colors duration-700 ease-in-out
  `;

  return (
      <Portal>
        <Show when={profile()}>
          {(data) => (
            <div
              class={boxStyle}
              style={{
                'background-color': mode() === 'dark' ? '#3b4252' : '#eceff4',
                'border-color': mode() === 'dark' ? '#4c566a' : '#d8dee9',
              }}
            >
              <h1
                class="text-3xl transition-colors duration-700"
                style={{ color: mode() === 'dark' ? '#eceff4' : '#2e3440' }}
              >
                {data().name}
              </h1>
              <div
                class="mt-1 transition-colors duration-700"
                style={{ color: mode() === 'dark' ? '#d8dee9' : '#2e3440' }}
              >
                {data().title}
              </div>
              <div
                class="mt-2 transition-colors duration-700"
                style={{ color: mode() === 'dark' ? '#81a1c1' : '#4c566a' }}
              >
                {data().description}
              </div>
              <div
                class="text-sm mt-1 transition-colors duration-700"
                style={{ color: mode() === 'dark' ? '#81a1c1' : '#4c566a' }}
              >
                {data().skills}
              </div>
              <div
                class="mt-4 mb-3 border-t transition-colors duration-700"
                style={{ 'border-color': mode() === 'dark' ? '#4c566a' : '#d8dee9' }}
              />
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
                          hover:text-[#81a1c1]
                          transition-all duration-200
                          hover:-translate-y-0.5
                        `}
                        style={{ color: mode() === 'dark' ? '#d8dee9' : 'rgba(76, 86, 106, 0.6)' }}
                      >
                        <Icon />
                        <span
                          class={`
                            absolute left-1/2 -translate-x-1/2 top-full mt-1
                            text-xs
                            border rounded px-1.5 py-0.5
                            opacity-0 group-hover:opacity-100
                            transition-opacity duration-200
                            pointer-events-none whitespace-nowrap
                          `}
                          style={{
                            color: mode() === 'dark' ? '#d8dee9' : '#4c566a',
                            'background-color': mode() === 'dark' ? '#3b4252' : '#eceff4',
                            'border-color': mode() === 'dark' ? '#4c566a' : '#d8dee9',
                          }}
                        >
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
