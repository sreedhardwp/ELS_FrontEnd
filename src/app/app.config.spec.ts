import { appConfig } from './app.config';

describe('App config', () => {
  it('should expose provider configuration', () => {
    expect(appConfig).toBeDefined();
    expect(Array.isArray(appConfig.providers)).toBeTrue();
    expect(appConfig.providers.length).toBeGreaterThanOrEqual(3);
  });
});