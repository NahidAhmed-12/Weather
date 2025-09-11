// src/pages/Home.jsx
import React, { useState, useEffect, useMemo } from 'react';
// শুধুমাত্র এই লাইনটি পরিবর্তন হবে
import { getWeatherInfo } from '../assets/icons';

// ছোট কম্পোনেন্টগুলো কোডকে আরও পাঠযোগ্য করে তোলে
const Loader = () => (
    <div className="text-center my-8">
        <svg className="animate-spin h-10 w-10 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-2 text-gray-300">Loading data...</p>
    </div>
);

const ErrorMessage = ({ message }) => (
    <div className="text-center text-yellow-300 mt-4">
        <p>{message}</p>
    </div>
);

const Home = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [locationInfo, setLocationInfo] = useState(null);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAPI = async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
        return await response.json();
    };

    const fetchWeather = async ({ city = null, coords = null }) => {
        setLoading(true);
        setError(null);
        setWeatherData(null);

        try {
            let latitude, longitude;

            if (city) {
                const geoApiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
                const geoData = await fetchAPI(geoApiUrl);
                if (!geoData.results || geoData.results.length === 0) throw new Error('City not found. Please try again.');
                const { latitude: lat, longitude: lon, name } = geoData.results[0];
                latitude = lat;
                longitude = lon;
                setLocationInfo({ city: name, country: geoData.results[0].country });
            } else if (coords) {
                latitude = coords.latitude;
                longitude = coords.longitude;
                const reverseGeoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
                const locData = await fetchAPI(reverseGeoUrl);
                setLocationInfo({ city: locData.city || locData.principalSubdivision, country: locData.countryName });
            } else {
                throw new Error("No location provided.");
            }

            const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,uv_index_max&timezone=auto`;
            const weather = await fetchAPI(weatherApiUrl);
            setWeatherData(weather);
            setSelectedDayIndex(0);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initialLoad = async () => {
            try {
                const response = await fetch('https://ipinfo.io/json');
                if (!response.ok) throw new Error('IP info fetch failed.');
                const data = await response.json();
                const [latitude, longitude] = data.loc.split(',');
                await fetchWeather({ coords: { latitude, longitude } });
            } catch (error) {
                console.warn("Could not auto-detect location. Defaulting to Dhaka.", error);
                await fetchWeather({ city: 'Dhaka' });
            }
        };
        initialLoad();
    }, []);

    const handleSearch = () => {
        if (city.trim()) {
            fetchWeather({ city: city.trim() });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const displayedWeather = useMemo(() => {
        if (!weatherData) return null;

        const isToday = selectedDayIndex === 0;
        const { daily, current } = weatherData;

        return {
            date: daily.time[selectedDayIndex],
            temp: isToday ? Math.round(current.temperature_2m) : Math.round(daily.temperature_2m_max[selectedDayIndex]),
            weatherCode: daily.weather_code[selectedDayIndex],
            maxTemp: Math.round(daily.temperature_2m_max[selectedDayIndex]),
            minTemp: Math.round(daily.temperature_2m_min[selectedDayIndex]),
            wind: daily.wind_speed_10m_max[selectedDayIndex].toFixed(1),
            humidity: isToday ? current.relative_humidity_2m : null,
            precipitation: daily.precipitation_sum[selectedDayIndex].toFixed(1),
            uv: daily.uv_index_max[selectedDayIndex].toFixed(1),
        };
    }, [weatherData, selectedDayIndex]);

    const weatherInfo = displayedWeather ? getWeatherInfo(displayedWeather.weatherCode) : null;

    return (
        <div className="main-container">
            <div className="flex items-center w-full max-w-lg mx-auto mb-8 shadow-lg rounded-full bg-black bg-opacity-30">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search for a city..."
                    className="w-full py-3 px-6 text-white bg-transparent rounded-l-full focus:outline-none placeholder-gray-400"
                />
                <button onClick={handleSearch} className="px-5 py-3 bg-cyan-500 rounded-r-full hover:bg-cyan-600 transition duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
            </div>

            {loading && <Loader />}
            {error && <ErrorMessage message={error} />}

            {weatherData && displayedWeather && locationInfo && (
                <div id="weather-content" className="animate-fade-in">
                    {/* UI Code... */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left mb-8">
                        <div className="flex flex-col justify-center items-center md:items-start">
                            <h2 className="text-4xl font-bold tracking-wide">{locationInfo.city}, {locationInfo.country}</h2>
                            <p className="text-lg text-gray-300 mt-1">
                                {selectedDayIndex === 0 ? "Today's Weather" : new Date(displayedWeather.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </p>
                            <div className="flex items-center my-4">
                                <div className="w-28 h-28 content-fade" dangerouslySetInnerHTML={{ __html: weatherInfo.i }} />
                                <p className="text-7xl font-bold ml-4 relative content-fade">
                                    {displayedWeather.temp}<span className="absolute top-2 -right-8 text-3xl font-light">°C</span>
                                </p>
                            </div>
                            <p className="text-xl capitalize font-light text-gray-200 mt-1 content-fade">{weatherInfo.d}</p>
                        </div>
                        <div className="flex flex-col justify-center items-center bg-black bg-opacity-20 p-6 rounded-2xl">
                            <h3 className="text-2xl font-semibold mb-4">Details</h3>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full text-lg content-fade">
                                <div className="text-center"><p className="font-light text-gray-300">Max Temp</p><p className="font-bold text-2xl">{displayedWeather.maxTemp}°</p></div>
                                <div className="text-center"><p className="font-light text-gray-300">Min Temp</p><p className="font-bold text-2xl">{displayedWeather.minTemp}°</p></div>
                                <div className="text-center"><p className="font-light text-gray-300">Wind</p><p className="font-bold text-2xl">{displayedWeather.wind} km/h</p></div>
                                <div className="text-center"><p className="font-light text-gray-300">Humidity</p><p className="font-bold text-2xl">{displayedWeather.humidity ?? '--'}%</p></div>
                                <div className="text-center"><p className="font-light text-gray-300">Precipitation</p><p className="font-bold text-2xl">{displayedWeather.precipitation} mm</p></div>
                                <div className="text-center"><p className="font-light text-gray-300">UV Index</p><p className="font-bold text-2xl">{displayedWeather.uv}</p></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-4">7-Day Forecast</h3>
                        <div id="forecast-scroll-container">
                            <div className="flex space-x-4 pb-3">
                                {weatherData.daily.time.slice(0, 7).map((date, index) => {
                                    const dayInfo = getWeatherInfo(weatherData.daily.weather_code[index]);
                                    return (
                                        <div
                                            key={date}
                                            className={`forecast-item p-4 rounded-xl cursor-pointer text-center w-28 flex-shrink-0 ${selectedDayIndex === index ? 'active' : ''}`}
                                            onClick={() => setSelectedDayIndex(index)}
                                        >
                                            <p className="font-semibold text-lg">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                            <div className="w-12 h-12 mx-auto my-2" dangerouslySetInnerHTML={{ __html: dayInfo.i }} />
                                            <p className="font-bold text-xl">{Math.round(weatherData.daily.temperature_2m_max[index])}°</p>
                                            <p className="text-gray-300">{Math.round(weatherData.daily.temperature_2m_min[index])}°</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;