import './style.css';
import { addTransaction, deleteTransaction, getBudget, getTransactions, saveBudget } from './utils/db';
import { dailyBudget, remainingBalance, remainingDays } from './services/budget-calculator';
import type { Budget, Transaction } from './models/types';
import { renderHistory } from './pages/history-page';

export async function initApp(): Promise<void> {
  const root = document.querySelector<HTMLDivElement>('#app');
  if (!root) return;

  let budget = await getBudget<Budget>();
  if (budget && !budget.endDate) budget = undefined;
  let transactions = await getTransactions<Transaction>();

  const render = () => {
    if (!budget) {
      root.innerHTML = `
      <main class="page"><section class="card start">
        <h1>Начнём!</h1>
        <p class="muted">Настройте бюджет на период</p>
        <form id="budget-form">
          <input id="balance" inputmode="numeric" type="number" placeholder="Стартовый баланс">
          <input id="date" type="date">
          <button>Рассчитать</button>
        </form>
      </section></main>`;
      document.querySelector('#budget-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const balance = Number((document.querySelector('#balance') as HTMLInputElement).value);
        const date = (document.querySelector('#date') as HTMLInputElement).value;
        budget = { initialBalance: balance, startDate: new Date().toISOString().slice(0,10), endDate: date, createdAt: new Date().toISOString().slice(0,10) };
        await saveBudget(budget);
        render();
      });
      return;
    }

    root.innerHTML = `
    <main class="page"><section class="dashboard">
      <header><h1>Мой бюджет</h1></header>
      <div class="metrics">
        <article><span>Общий баланс</span><strong>${remainingBalance(budget, transactions)} ₽</strong></article>
        <article><span>Дневной бюджет</span><strong>${dailyBudget(budget, transactions)} ₽</strong></article>
        <article><span>Остаток сегодня</span><strong>${Math.max(0, dailyBudget(budget, transactions))} ₽</strong></article>
        <article><span>Осталось дней</span><strong>${remainingDays(budget)}</strong></article>
      </div>
      <section class="card">
        <h2>Добавить расход</h2>
        <form id="expense"><input class="amount-input" id="amount" inputmode="numeric" type="number" placeholder="Сумма"><button>Сохранить</button></form>
      </section>
      <button id="open-history">История расходов</button>
      <section class="card"><h2>Последние операции</h2>${transactions.map(t=>`<div class="row"><span>${t.date.slice(0,10)}</span><b>- ${t.amount} ₽</b><button class="mini-delete" data-id="${t.id}">×</button></div>`).join('') || '<p class="muted">Операций нет</p>'}</section>
    </section></main>`;

    document.querySelector('#open-history')?.addEventListener('click', ()=>{
      root.innerHTML = renderHistory(transactions);
      document.querySelector('#back-main')?.addEventListener('click', render);
      const bindHistoryActions = () => {
        document.querySelector('#back-main')?.addEventListener('click', render);
        document.querySelectorAll<HTMLButtonElement>('.delete-transaction').forEach((button)=>{
          button.addEventListener('click', async ()=>{
            const id = Number(button.dataset.id);
            if (!Number.isNaN(id)) {
              await deleteTransaction(id);
              transactions = await getTransactions<Transaction>();
              root.innerHTML = renderHistory(transactions);
              bindHistoryActions();
            }
          });
        });
      };
      bindHistoryActions();
    });

    document.querySelectorAll<HTMLButtonElement>('.mini-delete').forEach((button)=>{
      button.addEventListener('click', async ()=>{
        const id = Number(button.dataset.id);
        if (!Number.isNaN(id)) {
          await deleteTransaction(id);
          transactions = await getTransactions<Transaction>();
          render();
        }
      });
    });

    document.querySelector('#expense')?.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const amount = Number((document.querySelector('#amount') as HTMLInputElement).value);
      await addTransaction({amount, type:'expense', date:new Date().toISOString()});
      transactions = await getTransactions<Transaction>();
      render();
    });
  };
  render();
}
