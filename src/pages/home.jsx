// src/pages/home.jsx
import React, { useState, useEffect, useMemo } from 'react';
// এই লাইনটি আপনার getWeatherInfo ফাংশনের সঠিক পাথ অনুযায়ী পরিবর্তন করুন
import { getWeatherInfo } from '../assets/icons';

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

    useEffect(() => {
        // সমস্ত গ্লোবাল স্টাইল এখন এই কম্পোনেন্টের ভেতরেই নিয়ন্ত্রিত হচ্ছে
        const css = `
            body {
                color: #ffffff;
                font-family: 'Inter', sans-serif;
                /* index.css থেকে ব্যাকগ্রাউন্ডটি এখানে নিয়ে আসা হয়েছে */
                background: linear-gradient(135deg, #1a2a3a, #2a4a5a, #3a6a7a);
            }
            .main-bg::before {
                content: '';
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100vh;
                background-image: url('https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=2565&auto=format&fit=crop');
                background-size: cover; background-position: center;
                z-index: -1; filter: brightness(0.7);
                transition: background-image 0.5s ease-in-out;
            }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
            .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
            .glass-card {
                background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
            }
            .custom-scrollbar::-webkit-scrollbar { height: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 10px; }
        `;
        const styleElement = document.createElement('style');
        styleElement.id = 'home-component-styles';
        styleElement.innerHTML = css;
        document.head.appendChild(styleElement);
        
        return () => {
            const style = document.getElementById('home-component-styles');
            if (style) document.head.removeChild(style);
        };
    }, []);

    const fetchAPI = async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Could not find the city. Please check the spelling.`);
        return response.json();
    };

    const fetchWeather = async ({ city = null, coords = null }) => {
        setLoading(true); setError(null); setWeatherData(null);
        try {
            let latitude, longitude;
            if (city) {
                const geoData = await fetchAPI(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
                if (!geoData.results?.length) throw new Error('City not found.');
                const { latitude: lat, longitude: lon, name, country } = geoData.results[0];
                latitude = lat; longitude = lon;
                setLocationInfo({ city: name, country });
            } else if (coords) {
                latitude = coords.latitude; longitude = coords.longitude;
                const locData = await fetchAPI(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                setLocationInfo({ city: locData.city || locData.principalSubdivision, country: locData.countryName });
            } else { throw new Error("No location provided."); }
            
            const weather = await fetchAPI(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,uv_index_max&timezone=auto`);
            setWeatherData(weather);
            setSelectedDayIndex(0);
        } catch (err) { setError(err.message); } 
        finally { setLoading(false); }
    };
    
    useEffect(() => {
        const initialLoad = async () => {
            try {
                const data = await fetchAPI('https://ipinfo.io/json');
                const [latitude, longitude] = data.loc.split(',');
                await fetchWeather({ coords: { latitude, longitude } });
            } catch (error) {
                console.warn("Could not auto-detect location, defaulting to Dhaka.", error);
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

    const weatherInfo = displayedWeather ? getWeatherInfo(displayedWeather.code) : null;

    return (
        <div className="main-bg">
            <main className="min-h-screen w-full p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Search Bar */}
                    <div className="flex w-full max-w-lg mx-auto mb-8 glass-card rounded-full">
                        <input
                            type="text" value={city} onChange={(e) => setCity(e.target.value)}
                            onKeyPress={handleKeyPress} placeholder="Search for a city..."
                            className="w-full py-3 px-6 text-white bg-transparent rounded-l-full focus:outline-none placeholder-slate-300"
                        />
                        <button onClick={handleSearch} className="px-5 py-3 bg-white/20 text-white rounded-r-full hover:bg-white/30 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </button>
                    </div>

                    {loading && <Loader />}
                    {error && <ErrorMessage message={error} />}

                    {weatherData && displayedWeather && locationInfo && (
                        <div className="animate-fade-in">
                            {/* --- Main Weather Display --- */}
                            <div className="glass-card rounded-2xl p-6 mb-6">
                                {/* Top Section: Location & Main Temp */}
                                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                                    <div>
                                        <h2 className="text-3xl lg:text-4xl font-bold tracking-wide">{locationInfo.city}, {locationInfo.country}</h2>
                                        <p className="text-slate-300 mt-1">{weatherInfo.d}</p>
                                    </div>
                                    <div className="flex items-center mt-4 md:mt-0">
                                        <div className="w-24 h-24 lg:w-28 lg:h-28" dangerouslySetInnerHTML={{ __html: weatherInfo.i }} />
                                        <div className="flex items-start ml-2">
                                            <p className="text-6xl lg:text-7xl font-bold">{displayedWeather.temp}</p>
                                            <span className="text-2xl font-light mt-2">°C</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Bottom Section: Details Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6 pt-6 border-t border-white/20 text-center">
                                    {[
                                        { label: 'Max Temp', value: `${displayedWeather.maxTemp}°` },
                                        { label: 'Min Temp', value: `${displayedWeather.minTemp}°` },
                                        { label: 'Wind', value: `${displayedWeather.wind} km/h` },
                                        { label: 'Humidity', value: `${displayedWeather.humidity ?? 'N/A'}%` },
                                        { label: 'Precipitation', value: `${displayedWeather.precipitation} mm` },
                                        { label: 'UV Index', value: displayedWeather.uv },
                                    ].map(item => (
                                        <div key={item.label}>
                                            <p className="text-sm text-slate-300">{item.label}</p>
                                            <p className="text-xl font-semibold mt-1">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* --- 7-Day Forecast --- */}
                            <div className="glass-card p-6 rounded-2xl">
                                <h3 className="text-2xl font-bold mb-4">7-Day Forecast</h3>
                                <div className="overflow-x-auto custom-scrollbar">
                                    <div className="flex space-x-4 pb-2">
                                        {weatherData.daily.time.slice(0, 7).map((date, index) => {
                                            const dayInfo = getWeatherInfo(weatherData.daily.weather_code[index]);
                                            const isActive = selectedDayIndex === index;
                                            return (
                                                <div
                                                    key={date}
                                                    className={`p-4 rounded-xl cursor-pointer text-center w-28 flex-shrink-0 transition-all border-2 ${isActive ? 'bg-white/30 border-white/50' : 'bg-white/10 border-transparent hover:bg-white/20'}`}
                                                    onClick={() => setSelectedDayIndex(index)}
                                                >
                                                    <p className="font-semibold">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                                    <div className="w-12 h-12 mx-auto my-2" dangerouslySetInnerHTML={{ __html: dayInfo.i }} />
                                                    <p className="font-bold text-xl">{Math.round(weatherData.daily.temperature_2m_max[index])}°</p>
                                                    <p className="text-slate-300">{Math.round(weatherData.daily.temperature_2m_min[index])}°</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;
