// GlobalExplorer — Interactive Trip Budget Calculator
// Currency conversion powered by the Frankfurter API (frankfurter.dev — free, no key required)

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('budget-form');
  if (!form) return;

  const resultEl = document.getElementById('budget-result');
  const currencySelect = document.getElementById('display-currency');
  const rateNote = document.getElementById('rate-note');

  let lastTotals = null;

  const PER_DAY = {
    budget:   { stay: 45,  food: 20, activities: 15, transport: 10 },
    mid:      { stay: 130, food: 45, activities: 40, transport: 25 },
    luxury:   { stay: 420, food: 110, activities: 120, transport: 70 }
  };

  function computeUSD() {
    const travelers = Math.max(1, parseInt(form.travelers.value || '1', 10));
    const nights = Math.max(1, parseInt(form.nights.value || '1', 10));
    const tier = form.tier.value;
    const rates = PER_DAY[tier];
    const flight = Math.max(0, parseFloat(form.flight.value || '0'));

    const stay = rates.stay * nights;
    const food = rates.food * nights * travelers;
    const activities = rates.activities * nights * travelers;
    const transport = rates.transport * nights * travelers;
    const flights = flight * travelers;

    const total = stay + food + activities + transport + flights;
    return { stay, food, activities, transport, flights, total, travelers, nights, tier };
  }

  async function convert(amountUSD, targetCurrency) {
    if (targetCurrency === 'USD') return { rate: 1, value: amountUSD };
    const res = await fetch(`https://api.frankfurter.dev/v1/latest?base=USD&symbols=${targetCurrency}`);
    if (!res.ok) throw new Error('rate lookup failed');
    const data = await res.json();
    const rate = data.rates[targetCurrency];
    return { rate, value: amountUSD * rate };
  }

  async function render() {
    const totals = computeUSD();
    lastTotals = totals;
    const currency = currencySelect.value;

    resultEl.setAttribute('aria-busy', 'true');
    try {
      const { rate, value } = await convert(totals.total, currency);
      const fmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
      resultEl.innerHTML = `
        <div class="pill">${totals.travelers} traveler${totals.travelers > 1 ? 's' : ''}</div>
        <div class="pill">${totals.nights} nights</div>
        <div class="pill">${totals.tier} tier</div>
        <h3 style="margin-top:18px;">${currency} ${fmt.format(value)}</h3>
        <p style="color:var(--mist);font-size:.85rem;">
          Estimated total trip cost, converted from USD${currency !== 'USD' ? ` at ${rate.toFixed(4)} ${currency} per USD (live rate)` : ''}.
        </p>
        <dl class="facts" style="margin-top:16px;display:grid;grid-template-columns:auto 1fr;gap:6px 14px;">
          <dt>Stay</dt><dd>$${Math.round(totals.stay)}</dd>
          <dt>Food</dt><dd>$${Math.round(totals.food)}</dd>
          <dt>Activities</dt><dd>$${Math.round(totals.activities)}</dd>
          <dt>Local transport</dt><dd>$${Math.round(totals.transport)}</dd>
          <dt>Flights</dt><dd>$${Math.round(totals.flights)}</dd>
        </dl>
      `;
      rateNote.textContent = currency === 'USD'
        ? 'Showing figures in US Dollars.'
        : `Exchange rate refreshed just now via live currency data.`;
    } catch (err) {
      resultEl.innerHTML = `<p>We could not reach the currency service. Showing USD instead.</p>
        <h3>USD ${Math.round(totals.total).toLocaleString()}</h3>`;
    } finally {
      resultEl.setAttribute('aria-busy', 'false');
    }
  }

  form.addEventListener('input', () => { render(); });
  currencySelect.addEventListener('change', () => { render(); });
  render();
});
