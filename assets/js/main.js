// GlobalExplorer — shared site behaviour

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  // Header shadow on scroll
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Live weather widgets — Open-Meteo (no API key required)
  document.querySelectorAll('[data-weather]').forEach(async (el) => {
    const lat = el.dataset.lat;
    const lon = el.dataset.lon;
    const city = el.dataset.city || 'Destination';
    el.setAttribute('data-state', 'loading');
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('weather request failed');
      const data = await res.json();
      const t = Math.round(data.current.temperature_2m);
      const wind = Math.round(data.current.wind_speed_10m);
      const desc = weatherCodeToText(data.current.weather_code);
      el.innerHTML = `
        <div class="wx-city">${city}</div>
        <div class="wx-temp">${t}&deg;C</div>
        <div class="wx-meta">${desc} &middot; wind ${wind} km/h &middot; live</div>
      `;
      el.setAttribute('data-state', 'ready');
    } catch (err) {
      el.innerHTML = `<div class="wx-city">${city}</div><div class="wx-meta">Live weather unavailable right now</div>`;
      el.setAttribute('data-state', 'error');
    }
  });
});

function weatherCodeToText(code) {
  const map = {
    0: 'Clear sky', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Icy fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
    61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Light snow', 73: 'Snow',
    75: 'Heavy snow', 80: 'Rain showers', 81: 'Rain showers', 82: 'Violent showers',
    95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Severe thunderstorm'
  };
  return map[code] || 'Conditions unavailable';
}
