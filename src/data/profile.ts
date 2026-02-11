export interface Link {
  label: string;
  href: string;
  icon: 'github' | 'email' | 'linkedin' | 'posts' | 'bluesky' | 'cv';
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
  description: 'Platform Engineering, DevEx',
  skills: 'Systems Design, APIs, Automation',
  links: [
    { label: 'GitHub', href: 'https://github.com/matt-forster', icon: 'github' },
    { label: 'Email', href: 'mailto:hey@mattforster.ca', icon: 'email' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mattforster', icon: 'linkedin' },
    { label: 'Posts', href: 'https://posts.mattforster.ca', icon: 'posts' },
    { label: 'Bluesky', href: 'https://mattforster.social', icon: 'bluesky' },
    { label: 'CV', href: 'https://github.com/matt-forster/cv', icon: 'cv' },
  ],
  experience: [],
};

export async function fetchProfile(): Promise<ProfileData> {
  return profile;
}
