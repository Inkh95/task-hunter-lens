export function score(task) {
  const reward = Number(task.reward), fee = Number(task.fee), hours = Number(task.hours);
  const acceptance = Number(task.acceptance), payout = Number(task.payout);
  if (![reward, fee, hours, acceptance, payout].every(Number.isFinite) ||
      reward <= 0 || fee < 0 || fee > reward || hours <= 0 ||
      acceptance < 0 || acceptance > 100 || payout < 0 || payout > 100) return null;
  const net = reward - fee;
  const expected = net * acceptance / 100 * payout / 100;
  return { net, expected, hourly: expected / hours };
}

export function rank(tasks) {
  return [...tasks].sort((a, b) =>
    (score(b)?.hourly ?? -1) - (score(a)?.hourly ?? -1) ||
    (a.createdAt || '').localeCompare(b.createdAt || ''));
}
