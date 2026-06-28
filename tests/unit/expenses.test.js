const {
  calculateMonthlyExpense,
  calculateYearlyExpense,
  calculateTotalExpense,
  getSubscriptionStats,
} = require('../../src/utils/expenses');

describe('calculateMonthlyExpense', () => {
  it('returns 0 for empty subscriptions', () => {
    expect(calculateMonthlyExpense([])).toBe(0);
  });

  it('sums monthly subscriptions directly', () => {
    const subs = [
      { price: 10, billingCycle: 'monthly' },
      { price: 20, billingCycle: 'monthly' },
    ];
    expect(calculateMonthlyExpense(subs)).toBe(30);
  });

  it('converts yearly subscriptions to monthly', () => {
    const subs = [
      { price: 120, billingCycle: 'yearly' },
      { price: 10, billingCycle: 'monthly' },
    ];
    expect(calculateMonthlyExpense(subs)).toBe(20);
  });
});

describe('calculateYearlyExpense', () => {
  it('returns 0 for empty subscriptions', () => {
    expect(calculateYearlyExpense([])).toBe(0);
  });

  it('sums yearly subscriptions directly', () => {
    const subs = [
      { price: 100, billingCycle: 'yearly' },
      { price: 200, billingCycle: 'yearly' },
    ];
    expect(calculateYearlyExpense(subs)).toBe(300);
  });

  it('converts monthly subscriptions to yearly', () => {
    const subs = [
      { price: 10, billingCycle: 'monthly' },
      { price: 100, billingCycle: 'yearly' },
    ];
    expect(calculateYearlyExpense(subs)).toBe(220);
  });
});

describe('calculateTotalExpense', () => {
  it('returns 0 for empty subscriptions', () => {
    expect(calculateTotalExpense([])).toBe(0);
  });

  it('sums all prices regardless of billing cycle', () => {
    const subs = [
      { price: 10, billingCycle: 'monthly' },
      { price: 120, billingCycle: 'yearly' },
    ];
    expect(calculateTotalExpense(subs)).toBe(130);
  });
});

describe('getSubscriptionStats', () => {
  it('returns correct stats for mixed subscriptions', () => {
    const subs = [
      { price: 10, billingCycle: 'monthly' },
      { price: 20, billingCycle: 'monthly' },
      { price: 120, billingCycle: 'yearly' },
    ];
    const stats = getSubscriptionStats(subs);
    expect(stats).toEqual({
      total: 150,
      monthly: 40,
      yearly: 480,
      byCycle: { monthly: 2, yearly: 1 },
      count: 3,
    });
  });

  it('returns zeros for empty subscriptions', () => {
    const stats = getSubscriptionStats([]);
    expect(stats).toEqual({
      total: 0,
      monthly: 0,
      yearly: 0,
      byCycle: { monthly: 0, yearly: 0 },
      count: 0,
    });
  });
});
