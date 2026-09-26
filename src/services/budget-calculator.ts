import type { Budget, Transaction } from '../models/types';

function endOfDay(date: string) {
  return new Date(`${date}T23:59:59`);
}

export function remainingBalance(budget: Budget, transactions: Transaction[]) {
  return budget.initialBalance - transactions.filter(t => t.type === 'expense').reduce((s,t)=>s+t.amount,0);
}

export function remainingDays(budget: Budget) {
  if (!budget.endDate) return 0;
  const now = new Date();
  const end = endOfDay(budget.endDate);
  const diff = Math.ceil((end.getTime() - now.getTime()) / 86400000);
  return Math.max(0, diff);
}

export function dailyBudget(budget: Budget, transactions: Transaction[]) {
  const days = Math.max(1, remainingDays(budget));
  return Math.round(remainingBalance(budget, transactions) / days);
}
