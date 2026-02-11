export interface Link {
  label: string;
  href: string;
  icon: 'github' | 'email';
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface ProfileData {
  name: string;
  title: string;
  description: string;
  skills: string;
  links: Link[];
  experience: Experience[];
}

const profile: ProfileData = {
  name: 'Matt Forster',
  title: 'Software Engineer',
  description: 'Backend Services, DevEx, Operations',
  skills: 'Software Architecture, Typescript, Golang',
  links: [
    { label: 'matt-forster', href: 'https://github.com/matt-forster', icon: 'github' },
    { label: 'hey@mattforster.ca', href: 'mailto:hey@mattforster.ca', icon: 'email' },
  ],
  experience: [],
};

export function getProfile(): ProfileData {
  return profile;
}
