import type { Component } from 'solid-js';
import { For } from 'solid-js';
import { Portal } from 'solid-js/web'
import { getProfile } from '../../data/profile';
import type { Link } from '../../data/profile';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" class="inline-block h-6 w-6">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z">
      </path>
    </svg>
)

const InboxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width={1.5} stroke="currentColor" class="inline-block w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
  </svg>
)

const iconComponents: Record<Link['icon'], Component> = {
  github: GithubIcon,
  email: InboxIcon,
};

const hoverColors: Record<Link['icon'], string> = {
  github: 'hover:text-[#81a1c1]',
  email: 'hover:text-[#5e81ac]',
};

export const Card: Component = () => {
  const profile = getProfile();

  const boxStyle = `
    bg-white
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
    overflow-hidden

    p-8

    rounded-lg
    shadow-md
    z-10
  `;

  const textStyle = `
    pl-1
    font-medium
  `;

  return (
      <Portal>
        <div class={boxStyle}>
          <h1 class="text-3xl">{profile.name}</h1>
          <div class="text-[#2e3440]">{profile.title} <br /><br/> <span>{profile.description}</span></div>
          <div class="text-[#4c566a] text-sm">{profile.skills}</div>
          <hr class="m-4"></hr>
          <div class="flex flex-col md:flex-row flex-wrap pt-2 text-sm">
            <For each={profile.links}>
              {(link, index) => {
                const Icon = iconComponents[link.icon];
                return (
                  <span class={index() > 0 ? 'md:pl-4' : ''}>
                    <a class={hoverColors[link.icon]} href={link.href}>
                      <Icon /><span class={textStyle}>{link.label}</span>
                    </a>
                  </span>
                );
              }}
            </For>
          </div>
        </div>
      </Portal>
  )
}
