// src/pages/Home.jsx
import React, { useState, useEffect, useMemo } from 'react';
// এই লাইনটি আপনার getWeatherInfo ফাংশনের সঠিক পাথ অনুযায়ী পরিবর্তন করুন
import { getWeatherInfo } from '../assets/icons';

// ছোট কম্পোনেন্টগুলো কোডকে আরও পাঠযোগ্য করে তোলে
const Loader = () => (
    <div className="text-center my-8">
        <svg className="animate-spin h-10 w-10 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-2 text-slate-300">Loading data...</p>
    </div>
);

const ErrorMessage = ({ message }) => (
    <div className="text-center text-yellow-300 glass-card p-4 rounded-lg mt-4 max-w-xl mx-auto">
        <p>Error: {message}</p>
    </div>
);

const Home = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [locationInfo, setLocationInfo] = useState(null);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect হুক ব্যবহার করে গ্লোবাল স্টাইল যোগ করা হয়েছে
    useEffect(() => {
        const css = `
            body {
                color: #ffffff;
                font-family: 'Inter', sans-serif;
                overflow-y: auto;
            }
            
            .main-container-wrapper::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background-image: url('https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=2565&auto=format&fit=crop');
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                z-index: -1;
                filter: brightness(0.8);
                transition: background-image 0.5s ease-in-out;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(15px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .animate-fade-in {
                animation: fadeIn 0.6s ease-out forwards;
            }

            .glass-card {
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
            }

            .custom-scrollbar::-webkit-scrollbar { height: 8px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.5); }
        `;

        const styleElement = document.createElement('style');
        styleElement.id = 'global-weather-styles';
        styleElement.innerHTML = css;
        document.head.appendChild(styleElement);

        // কম্পোনেন্ট আনমাউন্ট হলে স্টাইলটি সরিয়ে ফেলা হবে
        return () => {
            const style = document.getElementById('global-weather-styles');
            if (style) {
                document.head.removeChild(style);
            }
        };
    }, []); // খালি dependency array মানে এটি শুধু একবারই রান হবে

    const fetchAPI = async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Could not find the city. Please check the spelling.`);
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
                const { latitude: lat, longitude: lon, name, country } = geoData.results[0];
                latitude = lat;
                longitude = lon;
                setLocationInfo({ city: name, country });
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

    const handleSearch = () => city.trim() && fetchWeather({ city: city.trim() });
    const handleKeyPress = (e) => e.key === 'Enter' && handleSearch();

    const displayedWeather = useMemo(() => {
        if (!weatherData) return null;
        const { daily, current } = weatherData;
        const isToday = selectedDayIndex === 0;
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
        <div className="main-container-wrapper">
            <main className="min-h-screen w-full p-3 sm:p-6 md:p-8">
                {/* Search Bar */}
                <div className="flex w-full max-w-xl mx-auto mb-8 glass-card rounded-full">
                    <input
                        type="text" value={city} onChange={(e) => setCity(e.target.value)}
                        onKeyPress={handleKeyPress} placeholder="Search for a city..."
                        className="w-full py-2 px-4 sm:py-3 sm:px-6 text-white bg-transparent rounded-l-full focus:outline-none placeholder-slate-300"
                    />
                    <button onClick={handleSearch} className="px-4 sm:px-5 py-2 sm:py-3 bg-white/20 text-white rounded-r-full hover:bg-white/30 transition duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                </div>

                {loading && <Loader />}
                {error && <ErrorMessage message={error} />}

                {weatherData && displayedWeather && locationInfo && (
                    <div id="weather-content" className="max-w-6xl mx-auto animate-fade-in">
                        <div className="flex flex-col lg:flex-row gap-8 mb-8">
                            {/* Left Panel: Current Weather */}
                            <div className="w-full lg:w-1/2 glass-card rounded-2xl p-6 flex flex-col items-center md:items-start text-center md:text-left">
                                <h2 className="text-2xl sm:text-3xl font-bold tracking-wide">{locationInfo.city}, {locationInfo.country}</h2>
                                <p className="text-base sm:text-lg text-slate-300 mt-1">
                                    {selectedDayIndex === 0 ? "Today" : new Date(displayedWeather.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                </p>
                                <div className="flex flex-col sm:flex-row items-center my-4 w-full justify-center md:justify-start">
                                    <div className="w-28 h-28 sm:w-32 sm:h-32" dangerouslySetInnerHTML={{ __html: weatherInfo.i }} />
                                    <div className="flex items-start ml-0 sm:ml-4 mt-4 sm:mt-0">
                                        <p className="text-6xl sm:text-7xl lg:text-8xl font-bold relative">{displayedWeather.temp}</p>
                                        <span className="text-2xl sm:text-3xl font-light mt-2">°C</span>
                                    </div>
                                </div>
                                <p className="text-xl sm:text-2xl capitalize font-light">{weatherInfo.d}</p>
                            </div>

                            {/* Right Panel: Details */}
                            <div className="w-full lg:w-1/2 glass-card rounded-2xl p-6">
                                <h3 className="text-xl sm:text-2xl font-semibold mb-5 text-center">Details</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 sm:gap-x-4 gap-y-3 sm:gap-y-5 text-base sm:text-lg">
                                    {[
                                        { label: 'Max Temp', value: `${displayedWeather.maxTemp}°` },
                                        { label: 'Min Temp', value: `${displayedWeather.minTemp}°` },
                                        { label: 'Wind', value: `${displayedWeather.wind} km/h` },
                                        { label: 'Humidity', value: `${displayedWeather.humidity ?? '--'}%` },
                                        { label: 'Precipitation', value: `${displayedWeather.precipitation} mm` },
                                        { label: 'UV Index', value: displayedWeather.uv },
                                    ].map(item => (
                                        <div key={item.label} className="text-center p-2 rounded-lg bg-white/10">
                                            <p className="font-light text-slate-300 text-sm sm:text-base">{item.label}</p>
                                            <p className="font-bold text-xl sm:text-2xl">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 7-Day Forecast */}
                        <div className="glass-card p-4 sm:p-6 rounded-2xl">
                            <h3 className="text-xl sm:text-2xl font-bold mb-4">7-Day Forecast</h3>
                            <div className="overflow-x-auto pb-3 custom-scrollbar">
                                <div className="flex space-x-3 sm:space-x-4">
                                    {weatherData.daily.time.slice(0, 7).map((date, index) => {
                                        const dayInfo = getWeatherInfo(weatherData.daily.weather_code[index]);
                                        const isActive = selectedDayIndex === index;
                                        return (
                                            <div
                                                key={date}
                                                className={`p-3 sm:p-4 rounded-xl cursor-pointer text-center w-24 sm:w-28 flex-shrink-0 transition-all duration-300 border-2 ${isActive ? 'bg-white/30 border-white/50' : 'bg-white/10 border-transparent hover:bg-white/20'}`}
                                                onClick={() => setSelectedDayIndex(index)}
                                            >
                                                <p className="font-semibold text-base sm:text-lg">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto my-1 sm:my-2" dangerouslySetInnerHTML={{ __html: dayInfo.i }} />
                                                <p className="font-bold text-lg sm:text-xl">{Math.round(weatherData.daily.temperature_2m_max[index])}°</p>
                                                <p className="text-slate-300 text-sm sm:text-base">{Math.round(weatherData.daily.temperature_2m_min[index])}°</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
