const API_KEY = '7bfc0d6e6e0ad727ea4168a2cae86316';
const WEATHERSTACK_API_URL = 'http://api.weatherstack.com/current';


const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const currentLocationBtn = document.getElementById('current-location-btn');
const locationElement = document.getElementById('location');
const weatherIcon = document.getElementById('weather-icon');
const temperatureElement = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const feelsLikeElement = document.getElementById('feels-like');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const pressureElement = document.getElementById('pressure');
const errorMessage = document.getElementById('error-message');


function clearError() {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    console.error(message);
}


async function getWeatherData(city) {
    try {
        const url = `${WEATHERSTACK_API_URL}?access_key=${API_KEY}&query=${encodeURIComponent(city)}&units=m`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.info || 'Weather API error');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

async function getWeatherByCoordinates(lat, lon) {
    try {
        const url = `${WEATHERSTACK_API_URL}?access_key=${API_KEY}&query=${lat},${lon}&units=m`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.info || 'Weather API error');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}


function displayWeather(data) {
    try {
        const location = data.location;
        const current = data.current;
        
        locationElement.textContent = `${location.name}, ${location.country}`;
        temperatureElement.textContent = `${current.temperature}°C`;
        weatherDescription.textContent = current.weather_descriptions.join(', ');
        feelsLikeElement.textContent = `${current.feelslike}°C`;
        humidityElement.textContent = `${current.humidity}%`;
        windSpeedElement.textContent = `${current.wind_speed} km/h`;
        pressureElement.textContent = `${current.pressure} hPa`;
        
        if (current.weather_icons && current.weather_icons.length > 0) {
            weatherIcon.src = current.weather_icons[0];
            weatherIcon.alt = current.weather_descriptions[0] || 'Weather icon';
            weatherIcon.style.display = 'block';
        }
    } catch (error) {
        throw new Error('Failed to display weather data: ' + error.message);
    }
}


async function getWeatherByCity(city) {
    try {
        clearError();
        
        if (!city || city.trim() === '') {
            throw new Error('Please enter a city name');
        }
        
        const weatherData = await getWeatherData(city);
        displayWeather(weatherData);
        
    } catch (error) {
        showError(error.message);
    }
}

async function getWeatherByLocation() {
    try {
        clearError();
        
        if (!navigator.geolocation) {
            throw new Error('Geolocation is not supported by your browser');
        }
        
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 10000
            });
        });
        
        const { latitude: lat, longitude: lon } = position.coords;
        const weatherData = await getWeatherByCoordinates(lat, lon);
        displayWeather(weatherData);
    } catch (error) {
        showError('Error: ' + error.message);
    }
}


searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
    } else {
        showError('Please enter a city name');
    }
});

currentLocationBtn.addEventListener('click', getWeatherByLocation);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherByCity(city);
        } else {
            showError('Please enter a city name');
        }
    }
});


getWeatherByCity('Toronto');