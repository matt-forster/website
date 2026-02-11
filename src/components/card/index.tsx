import type { Component } from 'solid-js';
import { For, Show, createSignal, createResource } from 'solid-js';
import { Portal } from 'solid-js/web'
import { fetchProfile } from '../../data/profile';
import { iconComponents } from '../icons';
import { useTheme } from '../../context/theme';
import { palette, colors } from '../../theme';
import type { Link } from '../../data/profile';

const hoverColors: Record<Link['icon'], string> = {
  github: colors.nord9,
  email: colors.nord8,
  linkedin: colors.nord10,
  posts: colors.nord7,
  bluesky: colors.nord9,
  cv: colors.nord8,
};

export const Card: Component = () => {
  const [profile] = createResource(fetchProfile);
  const { mode } = useTheme();
  const [hoveredLabel, setHoveredLabel] = createSignal<string | null>(null);

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
                'background-color': mode() === 'dark' ? palette.nightCardBg : palette.dayCardBg,
                'border-color': mode() === 'dark' ? palette.nightBorder : palette.dayBorder,
              }}
            >
              <h1
                class="text-3xl transition-colors duration-700"
                style={{ color: mode() === 'dark' ? palette.nightText : palette.dayText }}
              >
                {data().name}
              </h1>
              <div
                class="mt-1 transition-colors duration-700"
                style={{ color: mode() === 'dark' ? palette.nightSecondaryText : palette.dayText }}
              >
                {data().title}
              </div>
              <div
                class="mt-2 transition-colors duration-700"
                style={{ color: mode() === 'dark' ? palette.nightMutedText : palette.dayMutedText }}
              >
                {data().description}
              </div>
              <div
                class="text-sm mt-1 transition-colors duration-700"
                style={{ color: mode() === 'dark' ? palette.nightMutedText : palette.dayMutedText }}
              >
                {data().skills}
              </div>
              <div
                class="mt-4 mb-3 border-t transition-colors duration-700"
                style={{ 'border-color': mode() === 'dark' ? palette.nightBorder : palette.dayBorder }}
              />
              <div class="flex items-center gap-3">
                <For each={data().links}>
                  {(link) => {
                    const Icon = iconComponents[link.icon];
                    return (
                      <a
                        href={link.href}
                        aria-label={link.label}
                        class="transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                          color: hoveredLabel() === link.label
                            ? hoverColors[link.icon]
                            : mode() === 'dark' ? palette.nightLinkColor : palette.dayLinkColor,
                        }}
                        onMouseEnter={() => setHoveredLabel(link.label)}
                        onMouseLeave={() => setHoveredLabel(null)}
                      >
                        <Icon />
                      </a>
                    );
                  }}
                </For>
                <span
                  aria-hidden="true"
                  class="text-xs ml-1 transition-opacity duration-200 whitespace-nowrap"
                  style={{
                    color: mode() === 'dark' ? palette.nightSecondaryText : palette.dayMutedText,
                    opacity: hoveredLabel() ? 1 : 0,
                  }}
                >
                  {hoveredLabel()}
                </span>
              </div>
            </div>
          )}
        </Show>
      </Portal>
  )
}
