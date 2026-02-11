import { fetchProfile } from './profile';
import type { ProfileData } from './profile';

describe('fetchProfile', () => {
  it('returns a valid ProfileData object', async () => {
    const profile: ProfileData = await fetchProfile();

    expect(profile.name).toBe('Matt Forster');
    expect(profile.title).toBe('Software Engineer');
    expect(profile.description).toBe('Backend Services, DevEx, Operations');
    expect(profile.skills).toBe('Software Architecture, Typescript, Golang');
  });

  it('includes links with required fields', async () => {
    const profile = await fetchProfile();

    expect(profile.links.length).toBeGreaterThanOrEqual(5);
    profile.links.forEach((link) => {
      expect(link.label).toBeTruthy();
      expect(link.href).toBeTruthy();
      expect(['github', 'email', 'linkedin', 'posts', 'bluesky']).toContain(link.icon);
    });
  });

  it('includes a github link', async () => {
    const profile = await fetchProfile();
    const github = profile.links.find((l) => l.icon === 'github');

    expect(github).toBeDefined();
    expect(github!.href).toContain('github.com');
  });

  it('includes an email link', async () => {
    const profile = await fetchProfile();
    const email = profile.links.find((l) => l.icon === 'email');

    expect(email).toBeDefined();
    expect(email!.href).toContain('mailto:');
  });

  it('includes a linkedin link', async () => {
    const profile = await fetchProfile();
    const linkedin = profile.links.find((l) => l.icon === 'linkedin');

    expect(linkedin).toBeDefined();
    expect(linkedin!.href).toContain('linkedin.com');
  });

  it('includes a posts link', async () => {
    const profile = await fetchProfile();
    const posts = profile.links.find((l) => l.icon === 'posts');

    expect(posts).toBeDefined();
    expect(posts!.href).toContain('posts.mattforster.ca');
  });

  it('includes a bluesky link', async () => {
    const profile = await fetchProfile();
    const bluesky = profile.links.find((l) => l.icon === 'bluesky');

    expect(bluesky).toBeDefined();
    expect(bluesky!.href).toContain('mattforster.social');
  });

  it('has an experience array', async () => {
    const profile = await fetchProfile();

    expect(Array.isArray(profile.experience)).toBe(true);
  });
});
