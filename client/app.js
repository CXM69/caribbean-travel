const form = document.getElementById('flight-form');
const statusEl = document.getElementById('status');
const resultsEl = document.getElementById('results');
const searchButton = document.getElementById('search-button');
const originInput = document.getElementById('origin');
const destinationInput = document.getElementById('destination');
const dateInput = document.getElementById('date');
const quickPickButtons = document.querySelectorAll('.quick-pick');

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.className = isError ? 'status error' : 'status';
}

function getDefaultDate() {
  const date = new Date();
  date.setDate(date.getDate() + 21);
  return date.toISOString().split('T')[0];
}

function normalizeErrorMessage(message) {
  if (!message) {
    return 'Flight search failed.';
  }

  if (message.toLowerCase().includes('too many requests')) {
    return 'Flight provider rate limit reached. Try again later or upgrade the API plan.';
  }

  return message;
}

dateInput.value = getDefaultDate();

quickPickButtons.forEach((button) => {
  button.addEventListener('click', () => {
    originInput.value = button.dataset.origin || '';
    destinationInput.value = button.dataset.destination || '';
    originInput.focus();
    setStatus('Route prefilled. Adjust anything you want, then search.');
  });
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const origin = originInput.value.trim();
  const destination = destinationInput.value.trim();
  const date = dateInput.value;

  resultsEl.innerHTML = '';
  searchButton.disabled = true;
  searchButton.textContent = 'Searching...';
  setStatus('Searching flights...');

  try {
    const params = new URLSearchParams({ origin, destination, date });
    const response = await fetch(`/search-flights?${params.toString()}`);
    const flights = await response.json().catch(() => []);

    if (!response.ok) {
      throw new Error(flights.error || 'Flight search failed.');
    }

    if (!flights.length) {
      setStatus('No flights found for that search.', true);
      return;
    }

    setStatus(`Found ${flights.length} flight option(s).`);

    flights.forEach((flight) => {
      const item = document.createElement('li');
      item.className = 'result-item';
      const viewFlightMarkup = flight.deeplink
        ? `<a class="view-flight" href="${flight.deeplink}" target="_blank" rel="noreferrer">View Flight</a>`
        : `<span class="view-flight disabled">View Flight</span>`;

      item.innerHTML = `
        <div class="result-top">
          <strong>${flight.airline || 'Unknown airline'}</strong>
          <span class="result-price">${flight.price || 'N/A'}</span>
        </div>
        <div class="result-times">
          <span><b>Departure</b> ${flight.departure || 'N/A'}</span>
          <span><b>Arrival</b> ${flight.arrival || 'N/A'}</span>
        </div>
        ${viewFlightMarkup}
      `;
      resultsEl.appendChild(item);
    });
  } catch (error) {
    setStatus(normalizeErrorMessage(error.message), true);
  } finally {
    searchButton.disabled = false;
    searchButton.textContent = 'Search Flights';
  }
});
