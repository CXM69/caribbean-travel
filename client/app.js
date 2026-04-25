const form = document.getElementById('flight-form');
const statusEl = document.getElementById('status');
const resultsEl = document.getElementById('results');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const origin = document.getElementById('origin').value.trim();
  const destination = document.getElementById('destination').value.trim();
  const date = document.getElementById('date').value;

  resultsEl.innerHTML = '';
  statusEl.textContent = 'Searching flights...';

  try {
    const params = new URLSearchParams({ origin, destination, date });
    const response = await fetch(`/search-flights?${params.toString()}`);
    const flights = await response.json();

    if (!response.ok) {
      throw new Error(flights.error || 'Flight search failed');
    }

    if (!flights.length) {
      statusEl.textContent = 'No flights found for that search.';
      return;
    }

    statusEl.textContent = `Found ${flights.length} flight option(s).`;

    flights.forEach((flight) => {
      const item = document.createElement('li');
      item.className = 'result-item';
      const viewFlightMarkup = flight.deeplink
        ? `<a class="view-flight" href="${flight.deeplink}" target="_blank" rel="noreferrer">View Flight</a>`
        : `<span class="view-flight disabled">View Flight</span>`;

      item.innerHTML = `
        <strong>${flight.airline || 'Unknown airline'}</strong>
        <span>Price: ${flight.price || 'N/A'}</span>
        <span>Departure: ${flight.departure || 'N/A'}</span>
        <span>Arrival: ${flight.arrival || 'N/A'}</span>
        ${viewFlightMarkup}
      `;
      resultsEl.appendChild(item);
    });
  } catch (error) {
    statusEl.textContent = error.message;
  }
});
