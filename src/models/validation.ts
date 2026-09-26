export type BudgetInput = { initialBalance: number; startDate: string; endDate: string };
export type TransactionInput = { amount: number; type: 'expense' | 'income'; date: string };

export function validateBudget(data: BudgetInput) {
  if (!data.initialBalance || data.initialBalance <= 0) return {ok:false, error:'Баланс должен быть положительным'};
  if (!data.startDate || !data.endDate || new Date(data.endDate) <= new Date(data.startDate)) return {ok:false, error:'Некорректный период'};
  return {ok:true, data};
}

export function validateTransaction(data: TransactionInput) {
  if (!data.amount || data.amount <= 0) return {ok:false, error:'Сумма должна быть больше 0'};
  if (!['expense','income'].includes(data.type)) return {ok:false, error:'Некорректный тип операции'};
  return {ok:true, data};
}
