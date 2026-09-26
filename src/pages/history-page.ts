export function renderHistory(transactions: any[]) {
  const total = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const avg = transactions.length ? Math.round(total / transactions.length) : 0;

  return `
  <section class="card history">
    <button id="back-main" class="secondary">← Назад</button>
    <h1>История расходов</h1>
    <div class="metrics">
      <article><span>Всего потрачено</span><strong>${total} ₽</strong></article>
      <article><span>Средние траты</span><strong>${avg} ₽</strong></article>
    </div>
    <div class="transactions">
    ${transactions.map(t => `
      <div class="row" data-id="${t.id}">
        <span>${new Date(t.date).toLocaleDateString('ru-RU', {day:'numeric', month:'long', year:'numeric'})}</span>
        <b>- ${t.amount} ₽</b>
        <button class="delete-transaction" data-id="${t.id}" aria-label="Удалить">×</button>
      </div>`).join('') || '<div class="empty-history"><strong>Операций нет</strong><span>Добавьте первый расход</span></div>'}
    </div>
  </section>`;
}
