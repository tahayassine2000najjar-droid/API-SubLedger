const calculateMonthlyExpense = (subscriptions) => {
  return subscriptions.reduce((total, sub) => {
    if (sub.billingCycle === 'monthly') return total + sub.price;
    if (sub.billingCycle === 'yearly') return total + sub.price / 12;
    return total;
  }, 0);
};

const calculateYearlyExpense = (subscriptions) => {
  return subscriptions.reduce((total, sub) => {
    if (sub.billingCycle === 'yearly') return total + sub.price;
    if (sub.billingCycle === 'monthly') return total + sub.price * 12;
    return total;
  }, 0);
};

const calculateTotalExpense = (subscriptions) => {
  return subscriptions.reduce((total, sub) => total + sub.price, 0);
};

const getSubscriptionStats = (subscriptions) => {
  const total = calculateTotalExpense(subscriptions);
  const monthly = calculateMonthlyExpense(subscriptions);
  const yearly = calculateYearlyExpense(subscriptions);
  const byCycle = {
    monthly: subscriptions.filter(s => s.billingCycle === 'monthly').length,
    yearly: subscriptions.filter(s => s.billingCycle === 'yearly').length,
  };
  return { total, monthly, yearly, byCycle, count: subscriptions.length };
};

module.exports = {
  calculateMonthlyExpense,
  calculateYearlyExpense,
  calculateTotalExpense,
  getSubscriptionStats,
};
