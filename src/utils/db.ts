import { openDB } from 'idb';

export const db = openDB('BudgetDB', 3, {
  upgrade(database) {
    if (!database.objectStoreNames.contains('budget')) database.createObjectStore('budget');
    if (!database.objectStoreNames.contains('transactions')) database.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
  },
});

export async function saveBudget(data: unknown) {
  const database = await db;
  return database.put('budget', data, 'current');
}

export async function getBudget<T>() {
  const database = await db;
  return database.get('budget', 'current') as Promise<T | undefined>;
}

export async function addTransaction(data: unknown) {
  const database = await db;
  return database.add('transactions', data);
}

export async function getTransactions<T>() {
  const database = await db;
  return database.getAll('transactions') as Promise<T[]>;
}

export async function deleteTransaction(id: number) {
  const database = await db;
  return database.delete('transactions', id);
}
