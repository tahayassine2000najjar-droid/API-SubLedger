const { validateUserSignup, validateSubscription } = require('../../src/middlewares/validationMiddleware');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('validateUserSignup', () => {
  const next = jest.fn();

  beforeEach(() => {
    next.mockClear();
  });

  it('passes valid signup data', () => {
    const req = { body: { name: 'John', email: 'john@test.com', password: '123456', role: 'user' } };
    const res = mockResponse();
    validateUserSignup(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('rejects missing name', () => {
    const req = { body: { email: 'john@test.com', password: '123456' } };
    const res = mockResponse();
    validateUserSignup(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects invalid email', () => {
    const req = { body: { name: 'John', email: 'notanemail', password: '123456' } };
    const res = mockResponse();
    validateUserSignup(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects short password', () => {
    const req = { body: { name: 'John', email: 'john@test.com', password: '12345' } };
    const res = mockResponse();
    validateUserSignup(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects invalid role', () => {
    const req = { body: { name: 'John', email: 'john@test.com', password: '123456', role: 'superadmin' } };
    const res = mockResponse();
    validateUserSignup(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('validateSubscription', () => {
  const next = jest.fn();

  beforeEach(() => {
    next.mockClear();
  });

  it('passes valid subscription data', () => {
    const req = { body: { name: 'Netflix', price: 15.99, billingCycle: 'monthly' } };
    const res = mockResponse();
    validateSubscription(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('rejects missing name', () => {
    const req = { body: { price: 15.99, billingCycle: 'monthly' } };
    const res = mockResponse();
    validateSubscription(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects zero or negative price', () => {
    const req = { body: { name: 'Netflix', price: 0, billingCycle: 'monthly' } };
    const res = mockResponse();
    validateSubscription(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects invalid billing cycle', () => {
    const req = { body: { name: 'Netflix', price: 15.99, billingCycle: 'weekly' } };
    const res = mockResponse();
    validateSubscription(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
