/* eslint-env jest */

import fastify from 'fastify';
import routes from './path-to-your-routes-file';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';
import { jest } from '@jest/globals';

describe('Fastify Routes', () => {
  let app;
  let mockCollection;
  let mockDb;
  let mockClient;

  beforeAll(async () => {
    app = fastify();
    mockCollection = {
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn(),
      findOne: jest.fn(),
      insertOne: jest.fn(),
    };
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };
    mockClient = {
      db: jest.fn().mockReturnValue(mockDb),
    };
    app.decorate('mongo', { client: mockClient });
    await app.register(routes);
  });

  afterAll(() => {
    app.close();
  });

  test('GET / should return hello world', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/',
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ hello: 'world' });
  });

  test('GET /properties should return properties', async () => {
    const mockProperties = [{ title: 'Property 1' }, { title: 'Property 2' }];
    mockCollection.toArray.mockResolvedValue(mockProperties);

    const response = await app.inject({
      method: 'GET',
      url: '/properties',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockProperties);
  });

  test('GET /properties should throw error if no documents found', async () => {
    mockCollection.toArray.mockResolvedValue([]);

    const response = await app.inject({
      method: 'GET',
      url: '/properties',
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({ error: 'Internal Server Error', message: 'No documents found', statusCode: 500 });
  });

  test('GET /properties/:id should return a property by id', async () => {
    const mockProperty = { title: 'Property 1' };
    mockCollection.findOne.mockResolvedValue(mockProperty);

    const response = await app.inject({
      method: 'GET',
      url: '/properties/507f1f77bcf86cd799439011',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockProperty);
  });

  test('GET /properties/:id should throw error if invalid id', async () => {
    mockCollection.findOne.mockResolvedValue(null);

    const response = await app.inject({
      method: 'GET',
      url: '/properties/507f1f77bcf86cd799439011',
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({ error: 'Internal Server Error', message: 'Invalid value', statusCode: 500 });
  });

  test('POST /properties should insert a new property', async () => {
    const mockProperty = {
      title: 'New Property',
      location: 'Location',
      price: 1000,
      images: ['image1.jpg', 'image2.jpg'],
    };
    const mockInsertResult = { insertedId: '507f1f77bcf86cd799439011' };
    mockCollection.insertOne.mockResolvedValue(mockInsertResult);

    const response = await app.inject({
      method: 'POST',
      url: '/properties',
      payload: mockProperty,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockInsertResult);
  });
});
