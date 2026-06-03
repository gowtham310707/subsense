const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const AuditLog = require('../models/AuditLog');
const Settings = require('../models/Settings');

let token;
let subscriptionId;
let userId;

// Setup & Teardown
beforeAll(async () => {
  // Wait for MongoDB to connect before clearing
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  // Clear collections before running tests
  await User.deleteMany({});
  await Subscription.deleteMany({});
  await AuditLog.deleteMany({});
  await Settings.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('AUTH', () => {
  it('TC-01: POST /api/auth/register → send {name, email, password, role, company} → expect 201, save userId', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
        company: 'Test Inc'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    userId = res.body._id;
  });

  it('TC-02: POST /api/auth/login → correct credentials → expect 200, save token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('TC-03: POST /api/auth/login → wrong password → expect 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toEqual(401);
  });

  it('TC-04: POST /api/auth/register → missing fields → expect 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Missing Fields User'
      });
    
    expect(res.statusCode).toEqual(400);
  });
});

describe('SUBSCRIPTIONS', () => {
  it('TC-05: POST /api/subscriptions → with token, send full subscription object → expect 201, save subscriptionId', async () => {
    const res = await request(app)
      .post('/api/subscriptions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Netflix',
        icon: 'netflix-icon',
        category: 'Entertainment',
        cost: 15.99,
        billing: 'monthly',
        seats: 4,
        nextRenewal: '2025-01-01',
        status: 'active',
        score: 95
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    subscriptionId = res.body._id;
  });

  it('TC-06: GET /api/subscriptions → with token → expect 200, array response', async () => {
    const res = await request(app)
      .get('/api/subscriptions')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('TC-07: PUT /api/subscriptions/:id → with token, update cost/status → expect 200', async () => {
    const res = await request(app)
      .put(`/api/subscriptions/${subscriptionId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        cost: 17.99,
        status: 'inactive'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.cost).toEqual(17.99);
    expect(res.body.status).toEqual('inactive');
  });

  it('TC-08: GET /api/subscriptions → no token → expect 401', async () => {
    const res = await request(app)
      .get('/api/subscriptions');
    
    expect(res.statusCode).toEqual(401);
  });

  it('TC-09: DELETE /api/subscriptions/:id → with token → expect 200', async () => {
    const res = await request(app)
      .delete(`/api/subscriptions/${subscriptionId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
  });
});

describe('AUDIT LOGS', () => {
  it('TC-10: POST /api/auditlogs → with token → expect 201', async () => {
    const res = await request(app)
      .post('/api/auditlogs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        action: 'Manual log entry test',
        type: 'test_action'
      });
    
    expect(res.statusCode).toEqual(201);
  });

  it('TC-11: GET /api/auditlogs → with token → expect 200, array', async () => {
    const res = await request(app)
      .get('/api/auditlogs')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('TC-12: POST /api/auditlogs → no token → expect 401', async () => {
    const res = await request(app)
      .post('/api/auditlogs')
      .send({
        action: 'Unauthorized test log',
        type: 'test_action'
      });
    
    expect(res.statusCode).toEqual(401);
  });
});

describe('SETTINGS', () => {
  it('TC-13: GET /api/settings → with token → expect 200', async () => {
    const res = await request(app)
      .get('/api/settings')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
  });

  it('TC-14: PUT /api/settings → with token, update {emailAlerts, slackAlerts, twoFactor, currency} → expect 200', async () => {
    const res = await request(app)
      .put('/api/settings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        emailAlerts: true,
        slackAlerts: true,
        twoFactor: true,
        currency: 'EUR'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.emailAlerts).toBe(true);
    expect(res.body.slackAlerts).toBe(true);
    expect(res.body.twoFactor).toBe(true);
    expect(res.body.currency).toBe('EUR');
  });

  it('TC-15: GET /api/settings → no token → expect 401', async () => {
    const res = await request(app)
      .get('/api/settings');
    
    expect(res.statusCode).toEqual(401);
  });
});
