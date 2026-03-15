// Base URL pointing to the local Node.js Express server
const API_URL = '/weather';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorMsg = document.getElementById('errorMsg');
const loading = document.getElementById('loading');
const weatherCard = document.getElementById('weatherCard');

// Data Elements
const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');

// Add event listener for button click
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city !== '') {
        getWeather(city);
    } else {
        showError('Please enter a city name');
    }
});

// Add event listener for "Enter" key press
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission if any
        searchBtn.click();
    }
});

/**
 * Fetch weather data from the backend API
 * @param {string} city - The city name to query
 */
async function getWeather(city) {
    // Hide previous UI states
    hideError();
    weatherCard.classList.add('hidden');
    
    // Show loading spinner
    loading.classList.remove('hidden');

    try {
        // Make request to the Node.js backend
        const response = await fetch(`${API_URL}?city=${encodeURIComponent(city)}`);
        
        // Check if response is not ok (e.g., 404 Not Found)
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch weather data');
        }

        // Parse JSON response
        const data = await response.json();
        
        // Update DOM with fetched data
        updateUI(data);

    } catch (error) {
        // Show error message and log it
        console.error('Fetch Error:', error);
        showError(error.message);
    } finally {
        // Always hide the loading spinner when request is done
        loading.classList.add('hidden');
    }
}

/**
 * Update the UI elements with weather data
 * @param {Object} data - Cleaned weather data from backend
 */
function updateUI(data) {
    // Update text content
    cityName.textContent = `${data.city}, ${data.country}`;
    temperature.innerHTML = `${Math.round(data.temperature)}&deg;C`;
    description.textContent = data.description;
    feelsLike.innerHTML = `${Math.round(data.feelsLike)}&deg;C`;
    humidity.textContent = `${data.humidity}%`;
    windSpeed.textContent = `${data.windSpeed} km/h`;

    // Fetch weather icon from OpenWeatherMap using the icon code provided
    const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
    weatherIcon.src = iconUrl;

    // Show the weather card
    weatherCard.classList.remove('hidden');
}

/**
 * Helper to show error message
 * @param {string} msg - The error message to display
 */
function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
}

/**
 * Helper to hide error message
 */
function hideError() {
    errorMsg.textContent = '';
    errorMsg.classList.add('hidden');
}
