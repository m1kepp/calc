export type Budget = { initialBalance: number; endDate: string; startDate: string; createdAt?: string };
export type Transaction = { id?: number; amount: number; type: 'expense' | 'income'; date: string };
