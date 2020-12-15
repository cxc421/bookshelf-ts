import {MockedRequest} from 'msw';
import {server, rest} from 'test/server';
import {client} from '../api-client';

jest.mock('test/server');

beforeAll(() => (server as any).listen());
afterAll(() => (server as any).close());
afterEach(() => server.resetHandlers());

const apiUrl = process.env.REACT_APP_API_URL;

test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  const endpoint = `test-endpoint`;
  const mockResult = {mockValue: 'VALUE'};
  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(mockResult));
    }),
  );

  const result = await client(endpoint);
  expect(result).toEqual(mockResult);
});

test('adds auth token when a token is provided', async () => {
  let request: MockedRequest | null = null;
  const fakeToken = 'fake-token';
  const endpoint = 'test-endpoint';
  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      request = req;
      return res(ctx.json({message: 'ok'}));
    }),
  );

  await client(endpoint, {token: fakeToken});
  expect(request!.headers.get('Authorization')).toBe(`Bearer ${fakeToken}`);
});

test('allows for config overrides', async () => {
  let request: MockedRequest | null = null;
  const endpoint = 'test-endpoint';
  server.use(
    rest.put(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      request = req;
      return res(ctx.json({message: 'ok'}));
    }),
  );
  const customConfig = {
    method: 'PUT',
    headers: {
      'Content-Type': 'fake-type',
    },
  };

  await client(endpoint, customConfig);
  expect(request!.headers.get('Content-Type')).toBe(
    customConfig.headers['Content-Type'],
  );
});

test('when data is provided, it is stringified and the method defaults to POST', async () => {
  const endpoint = 'test-endpoint';
  server.use(
    rest.post(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(req.body));
    }),
  );
  const data = {id: 1};

  const result = await client(endpoint, {data});
  expect(result).toEqual(data);
});
