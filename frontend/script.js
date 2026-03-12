const API_BASE = 'https://weatherscope-b17v.onrender.com';

// ── DOM references ────────────────────────────────────────────
const cityInput   = document.getElementById('cityInput');
const searchBtn   = document.getElementById('searchBtn');
const loader      = document.getElementById('loader');
const weatherCard = document.getElementById('weatherCard');
const errorCard   = document.getElementById('errorCard');
const cardCity    = document.getElementById('cardCity');
const cardTemp    = document.getElementById('cardTemp');
const cardWind    = document.getElementById('cardWind');
const errorMsg    = document.getElementById('errorMessage');

// ── State helpers ─────────────────────────────────────────────
function showLoader() {
  loader.classList.remove('hidden');
  weatherCard.classList.add('hidden');
  errorCard.classList.add('hidden');
}

function showWeather(data) {
  loader.classList.add('hidden');
  errorCard.classList.add('hidden');

  cardCity.textContent = data.city;
  cardTemp.textContent = data.temperature;
  cardWind.textContent = data.wind_speed;

  weatherCard.classList.remove('hidden');
}

function showError(message) {
  loader.classList.add('hidden');
  weatherCard.classList.add('hidden');

  errorMsg.textContent = message;
  errorCard.classList.remove('hidden');
}

function setSearching(active) {
  searchBtn.disabled = active;
  cityInput.disabled = active;
}

// ── Fetch weather ─────────────────────────────────────────────
async function fetchWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    cityInput.focus();
    return;
  }

  setSearching(true);
  showLoader();

  try {
    const url = `${API_BASE}/weather?city=${encodeURIComponent(city)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      showError(data.error === 'City not found'
        ? `We couldn't find weather data for "${city}". Please check the city name.`
        : data.error
      );
    } else {
      showWeather(data);
    }

  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      showError('Unable to reach the weather server. Make sure the backend is running at ' + API_BASE);
    } else {
      showError('Something went wrong. Please try again.');
    }
    console.error('[WeatherScope]', err);
  } finally {
    setSearching(false);
  }
}

// ── Event listeners ───────────────────────────────────────────
searchBtn.addEventListener('click', fetchWeather);

cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') fetchWeather();
});
