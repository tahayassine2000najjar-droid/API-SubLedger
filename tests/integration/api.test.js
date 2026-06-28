jest.setTimeout(300000);

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: { version: '7.0.0' },
  });
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 300000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('Auth - POST /api/auth/signup', () => {
  it('creates a new user and returns a token', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Test User', email: 'test@test.com', password: 'password123', role: 'user' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toBe('test@test.com');
    expect(res.body.role).toBe('user');
  });

  it('rejects duplicate email', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ name: 'User One', email: 'dupe@test.com', password: 'password123' });
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'User Two', email: 'dupe@test.com', password: 'password123' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });

  it('rejects invalid data', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'bad', password: '123' });
    expect(res.status).toBe(400);
  });
});

describe('Auth - POST /api/auth/login', () => {
  beforeEach(async () => {
    const User = require('../../src/models/User');
    await User.deleteMany({});
    await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Login User', email: 'login@test.com', password: 'password123', role: 'user' });
  });

  it('logs in with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toBe('login@test.com');
  });

  it('rejects invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'wrongpassword' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('rejects non-existent user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@test.com', password: 'password123' });
    expect(res.status).toBe(401);
  });
});

describe('Subscriptions - POST /api/subscriptions', () => {
  let userToken;

  beforeEach(async () => {
    const User = require('../../src/models/User');
    const Subscription = require('../../src/models/Subscription');
    await User.deleteMany({});
    await Subscription.deleteMany({});
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Test User', email: 'user@test.com', password: 'password123', role: 'user' });
    userToken = res.body.token;
  });

  it('creates a subscription', async () => {
    const res = await request(app)
      .post('/api/subscriptions')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Netflix', price: 15.99, billingCycle: 'monthly' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Netflix');
    expect(res.body.price).toBe(15.99);
  });

  it('rejects unauthenticated request', async () => {
    const res = await request(app)
      .post('/api/subscriptions')
      .send({ name: 'Netflix', price: 15.99, billingCycle: 'monthly' });
    expect(res.status).toBe(401);
  });

  it('rejects invalid subscription data', async () => {
    const res = await request(app)
      .post('/api/subscriptions')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Netflix', price: -5, billingCycle: 'monthly' });
    expect(res.status).toBe(400);
  });
});

describe('Subscriptions - GET /api/subscriptions', () => {
  let userToken;

  beforeEach(async () => {
    const User = require('../../src/models/User');
    const Subscription = require('../../src/models/Subscription');
    await User.deleteMany({});
    await Subscription.deleteMany({});
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Test User', email: 'user@test.com', password: 'password123', role: 'user' });
    userToken = res.body.token;
  });

  it('returns empty array when no subscriptions', async () => {
    const res = await request(app)
      .get('/api/subscriptions')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns user subscriptions', async () => {
    await request(app)
      .post('/api/subscriptions')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Netflix', price: 15.99, billingCycle: 'monthly' });
    await request(app)
      .post('/api/subscriptions')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Spotify', price: 9.99, billingCycle: 'monthly' });

    const res = await request(app)
      .get('/api/subscriptions')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('Subscriptions - PUT /api/subscriptions/:id', () => {
  let userToken;

  beforeEach(async () => {
    const User = require('../../src/models/User');
    const Subscription = require('../../src/models/Subscription');
    await User.deleteMany({});
    await Subscription.deleteMany({});
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Test User', email: 'user@test.com', password: 'password123', role: 'user' });
    userToken = res.body.token;
  });

  it('updates a subscription', async () => {
    const created = await request(app)
      .post('/api/subscriptions')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Netflix', price: 15.99, billingCycle: 'monthly' });

    const res = await request(app)
      .put(`/api/subscriptions/${created.body._id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Netflix Premium', price: 19.99, billingCycle: 'yearly' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Netflix Premium');
    expect(res.body.price).toBe(19.99);
  });
});

describe('Subscriptions - DELETE /api/subscriptions/:id', () => {
  let userToken;

  beforeEach(async () => {
    const User = require('../../src/models/User');
    const Subscription = require('../../src/models/Subscription');
    await User.deleteMany({});
    await Subscription.deleteMany({});
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Test User', email: 'user@test.com', password: 'password123', role: 'user' });
    userToken = res.body.token;
  });

  it('deletes a subscription', async () => {
    const created = await request(app)
      .post('/api/subscriptions')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Netflix', price: 15.99, billingCycle: 'monthly' });

    const res = await request(app)
      .delete(`/api/subscriptions/${created.body._id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Subscription removed');
  });
});
