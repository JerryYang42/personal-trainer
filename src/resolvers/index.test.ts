import { describe, it, expect } from 'vitest';
import { resolvers } from './index';

describe('resolvers', () => {
  it('exports a resolvers object', () => {
    expect(resolvers).toBeDefined();
    expect(typeof resolvers).toBe('object');
  });

  it('has a Query property', () => {
    expect(resolvers).toHaveProperty('Query');
    expect(typeof resolvers.Query).toBe('object');
  });

  it('_health resolver returns "ok"', () => {
    expect(resolvers.Query._health()).toBe('ok');
  });
});
