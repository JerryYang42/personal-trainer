import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { ApolloServer } from '@apollo/server';
import { typeDefs } from '../schema/typeDefs.js';
import { resolvers } from './index.js';

describe('resolvers', () => {
  it('_health resolver returns "ok"', () => {
    assert.equal(resolvers.Query._health(), 'ok');
  });
});

describe('Apollo Server', () => {
  let server: ApolloServer;

  before(async () => {
    server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
  });

  after(async () => {
    await server.stop();
  });

  it('executes _health query', async () => {
    const result = await server.executeOperation({ query: '{ _health }' });
    assert(result.body.kind === 'single');
    assert.equal(result.body.singleResult.data?._health, 'ok');
    assert.equal(result.body.singleResult.errors, undefined);
  });
});
