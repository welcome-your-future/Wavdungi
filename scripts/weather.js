
// DOM elements
const searchInput = document.querySelector('.search-input');
const clearSearchBtn = document.querySelector('.clear-search');
const searchResults = document.querySelector('.search-results-dropdown');
const resultsHeader = searchResults.querySelector('.search-results-header span');
const resultsBody = searchResults.querySelector('.search-results-body');
const weatherRefreshBtn = document.querySelector('.weather-refresh-btn');
const weatherLocation = document.querySelector('.weather-location');
const tempValue = document.querySelector('.temp-value');
const tempFeels = document.querySelector('.temp-feels');
const weatherDesc = document.querySelector('.weather-desc');
const weatherIcon = document.querySelector('.weather-icon-temp i');
const humidityStat = document.querySelector('.weather-stat:nth-child(1) span');
const windStat = document.querySelector('.weather-stat:nth-child(2) span');
const pressureStat = document.querySelector('.weather-stat:nth-child(3) span');
const sunTimes = document.querySelector('.weather-sun-times');
const timestamp = document.querySelector('.weather-timestamp small');
const closeResultsBtn = document.querySelector('.close-results');

// Weather API configuration
const WEATHER_CONFIG = {
    apiKey: "c8fdcc2319595e62f2b13dad5b95ad7d",
    city: "Gondia",
    country: "IN",
    units: "metric",
    language: "mr"
};

// Homepage content for searching
const homepageContent = [
    {
        id: 1,
        title: "गावा विषयी",
        category: "माहिती",
        description: "ग्रामपंचायत वडेगाव(स्टेशन) हे गोंदिया जिल्ह्यातील अर्जुनी/मोरगाव तालुक्यात वसलेले एक शेती प्रधान आणि प्रगतशील गाव",
        keywords: ["गाव", "वडेगाव", "गोंदिया", "ग्रामपंचायत", "माहिती", "परिचय"],
        link: "#about-section",
        type: "internal"
    },
    {
        id: 2,
        title: "ग्रामपंचायत अधिकारी",
        category: "अधिकारी",
        description: "सरपंच, उपसरपंच आणि ग्रामपंचायत अधिकारी यांची माहिती",
        keywords: ["सरपंच", "उपसरपंच", "अधिकारी", "संपर्क", "लोणारे", "रामटेके", "अवसरे"],
        link: "#officers-section",
        type: "internal"
    },
    {
        id: 3,
        title: "सुविधा आणि सेवा",
        category: "सुविधा",
        description: "पाणी, वीज, रस्ते, आरोग्य केंद्र, शाळा, अंगणवाडी इत्यादी सुविधा",
        keywords: ["पाणी", "वीज", "रस्ते", "आरोग्य", "शाळा", "अंगणवाडी", "सुविधा", "सेवा"],
        link: "#facilities-section",
        type: "internal"
    },
    {
        id: 4,
        title: "शासकीय योजना",
        category: "योजना",
        description: "१५ वित्त आयोग, जल जीवन मिशन, प्रधान मंत्री आवास योजना, महात्मा गांधी रोजगार हमी योजना",
        keywords: ["योजना", "जल जीवन", "आवास", "रोजगार", "तांडा", "वस्ती", "रमाई", "शबरी"],
        link: "#schemes-section",
        type: "internal"
    },
    {
        id: 5,
        title: "लोकसंख्या",
        category: "माहिती",
        description: "गावातील लोकसंख्या, कुटुंबांची संख्या, पुरुष-महिला गणना",
        keywords: ["लोकसंख्या", "कुटुंब", "पुरुष", "महिला", "गणना", "संख्या"],
        link: "#about-section",
        type: "internal"
    },
    {
        id: 6,
        title: "स्वच्छता अभियान",
        category: "कार्यक्रम",
        description: "ग्रामपंचायत मध्ये चालू असलेले स्वच्छता अभियान",
        keywords: ["स्वच्छता", "अभियान", "सफाई", "कचरा", "व्यवस्थापन"],
        link: "#facilities-section",
        type: "internal"
    }
];

// Event listeners
searchInput.addEventListener('input', handleSearch);
searchInput.addEventListener('focus', handleInputFocus);
clearSearchBtn.addEventListener('click', clearSearch);
weatherRefreshBtn.addEventListener('click', fetchWeatherData);
closeResultsBtn.addEventListener('click', closeResults);

// Close search results when clicking outside
document.addEventListener('click', function (event) {
    if (!event.target.closest('.search-section')) {
        closeResults();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && searchResults.style.display === 'block') {
        closeResults();
        searchInput.focus();
    }
});

// Initialize weather data on page load
document.addEventListener('DOMContentLoaded', function () {
    fetchWeatherData();
});

// Functions
function handleSearch(e) {
    const searchTerm = e.target.value.trim();

    if (searchTerm === '') {
        closeResults();
        clearSearchBtn.style.display = 'none';
        return;
    }

    clearSearchBtn.style.display = 'block';

    // Perform search
    const results = performSearch(searchTerm);

    // Update UI with results
    updateSearchResults(searchTerm, results);
}

function performSearch(searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();

    return homepageContent.filter(item => {
        return (
            item.title.toLowerCase().includes(lowerSearchTerm) ||
            item.description.toLowerCase().includes(lowerSearchTerm) ||
            item.keywords.some(keyword =>
                keyword.toLowerCase().includes(lowerSearchTerm)
            ) ||
            item.category.toLowerCase().includes(lowerSearchTerm)
        );
    });
}

function updateSearchResults(searchTerm, results) {
    resultsHeader.textContent = `शोध निकाल: "${searchTerm}"`;

    if (results.length > 0) {
        // Clear previous results
        resultsBody.innerHTML = '';

        // Create results list
        const resultsList = document.createElement('div');
        resultsList.className = 'search-results-list';

        // Add each result to the list
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.setAttribute('role', 'button');
            resultItem.setAttribute('tabindex', '0');

            resultItem.innerHTML = `
                        <div class="result-content">
                            <div class="result-header">
                                <h6 class="result-title">${result.title}</h6>
                                <span class="result-category">${result.category}</span>
                            </div>
                            <p class="result-description">${result.description}</p>
                            <div class="result-keywords">
                                ${result.keywords.slice(0, 3).map(keyword =>
                `<span class="keyword-tag">${keyword}</span>`
            ).join('')}
                            </div>
                        </div>
                        <i class="fas fa-chevron-right result-arrow"></i>
                    `;

            resultItem.addEventListener('click', () => navigateToResult(result));
            resultItem.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigateToResult(result);
                }
            });

            resultsList.appendChild(resultItem);
        });

        resultsBody.appendChild(resultsList);
    } else {
        // Show no results message
        resultsBody.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search no-results-icon"></i>
                        <p>'${searchTerm}' साठी कोणतेही निकाल सापडले नाहीत</p>
                        <small>कृपया वेगळे कीवर्ड वापरून पहा</small>
                    </div>
                `;
    }

    // Show results dropdown
    searchResults.style.display = 'block';
}

function navigateToResult(result) {
    console.log('Navigating to:', result);
    closeResults();
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';

    if (result.link) {
        if (result.link.startsWith('#')) {
            const element = document.querySelector(result.link);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        } else {
            window.location.href = result.link;
        }
    }
}

function handleInputFocus() {
    if (searchInput.value.trim() !== '') {
        const searchTerm = searchInput.value.trim();
        const results = performSearch(searchTerm);
        updateSearchResults(searchTerm, results);
    }
}

function clearSearch() {
    searchInput.value = '';
    closeResults();
    clearSearchBtn.style.display = 'none';
    searchInput.focus();
}

function closeResults() {
    searchResults.style.display = 'none';
}

async function fetchWeatherData() {
    try {
        // Show loading state
        weatherRefreshBtn.querySelector('i').classList.add('fa-spin');

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CONFIG.city},${WEATHER_CONFIG.country}&units=${WEATHER_CONFIG.units}&lang=${WEATHER_CONFIG.language}&appid=${WEATHER_CONFIG.apiKey}`
        );

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();
        updateWeatherUI(data);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        // Fallback to static data if API fails
        updateWeatherUIWithFallback();
    } finally {
        weatherRefreshBtn.querySelector('i').classList.remove('fa-spin');
    }
}

function updateWeatherUI(data) {
    // Update weather location
    weatherLocation.textContent = data.name + ', ' + (data.sys.country === 'IN' ? 'भारत' : data.sys.country);

    // Update temperature
    tempValue.textContent = Math.round(data.main.temp) + '°C';
    tempFeels.textContent = 'जाणवते: ' + Math.round(data.main.feels_like) + '°C';

    // Update weather description
    weatherDesc.textContent = data.weather[0].description;

    // Update weather icon
    const iconClass = getWeatherIcon(data.weather[0].icon);
    weatherIcon.className = iconClass;

    // Update weather stats
    humidityStat.textContent = data.main.humidity + '%';
    windStat.textContent = data.wind.speed + ' m/s';
    pressureStat.textContent = data.main.pressure + ' hPa';

    // Update sunrise and sunset times
    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString('mr-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString('mr-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });

    sunTimes.innerHTML = `
                <div class="sun-time">
                    <i class="fas fa-sun"></i>
                    <span>सूर्योदय: ${sunriseTime}</span>
                </div>
                <div class="sun-time">
                    <i class="fas fa-moon"></i>
                    <span>सूर्यास्त: ${sunsetTime}</span>
                </div>
            `;

    // Update timestamp
    const now = new Date();
    timestamp.textContent = 'अद्ययावत: ' + now.toLocaleString('mr-IN');
}

function updateWeatherUIWithFallback() {
    // Fallback data in case API fails
    weatherLocation.textContent = 'वडेगाव, गोंदिया';
    tempValue.textContent = '28°C';
    tempFeels.textContent = 'जाणवते: 30°C';
    weatherDesc.textContent = 'सौम्य ढगाळ';
    weatherIcon.className = 'fas fa-cloud-sun';
    humidityStat.textContent = '65%';
    windStat.textContent = '3.5 m/s';
    pressureStat.textContent = '1013 hPa';

    sunTimes.innerHTML = `
                <div class="sun-time">
                    <i class="fas fa-sun"></i>
                    <span>सूर्योदय: 06:15</span>
                </div>
                <div class="sun-time">
                    <i class="fas fa-moon"></i>
                    <span>सूर्यास्त: 18:45</span>
                </div>
            `;

    const now = new Date();
    timestamp.textContent = 'अद्ययावत: ' + now.toLocaleString('mr-IN');
}

function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': 'fas fa-sun',
        '01n': 'fas fa-moon',
        '02d': 'fas fa-cloud-sun',
        '02n': 'fas fa-cloud-moon',
        '03d': 'fas fa-cloud',
        '03n': 'fas fa-cloud',
        '04d': 'fas fa-cloud',
        '04n': 'fas fa-cloud',
        '09d': 'fas fa-cloud-rain',
        '09n': 'fas fa-cloud-rain',
        '10d': 'fas fa-cloud-sun-rain',
        '10n': 'fas fa-cloud-moon-rain',
        '11d': 'fas fa-bolt',
        '11n': 'fas fa-bolt',
        '13d': 'fas fa-snowflake',
        '13n': 'fas fa-snowflake',
        '50d': 'fas fa-smog',
        '50n': 'fas fa-smog'
    };

    return iconMap[iconCode] || 'fas fa-cloud';
}
