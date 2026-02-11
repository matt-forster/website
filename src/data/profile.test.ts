import { getProfile } from './profile';
import type { ProfileData } from './profile';

describe('getProfile', () => {
  it('returns a valid ProfileData object', () => {
    const profile: ProfileData = getProfile();

    expect(profile.name).toBe('Matt Forster');
    expect(profile.title).toBe('Software Engineer');
    expect(profile.description).toBe('Backend Services, DevEx, Operations');
    expect(profile.skills).toBe('Software Architecture, Typescript, Golang');
  });

  it('includes links with required fields', () => {
    const profile = getProfile();

    expect(profile.links.length).toBeGreaterThanOrEqual(2);
    profile.links.forEach((link) => {
      expect(link.label).toBeTruthy();
      expect(link.href).toBeTruthy();
      expect(['github', 'email']).toContain(link.icon);
    });
  });

  it('includes a github link', () => {
    const profile = getProfile();
    const github = profile.links.find((l) => l.icon === 'github');

    expect(github).toBeDefined();
    expect(github!.href).toContain('github.com');
  });

  it('includes an email link', () => {
    const profile = getProfile();
    const email = profile.links.find((l) => l.icon === 'email');

    expect(email).toBeDefined();
    expect(email!.href).toContain('mailto:');
  });

  it('has an experience array', () => {
    const profile = getProfile();

    expect(Array.isArray(profile.experience)).toBe(true);
  });
});
