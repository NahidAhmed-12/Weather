import React, { useState, useEffect, useMemo } from 'react';

// --- আইকন কম্পোনেন্টগুলো ---
const UvIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 inline-block"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>;
const WindIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 inline-block"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"></path><path d="M9.6 4.6A2 2 0 1 1 11 8H2"></path><path d="M12.6 19.4A2 2 0 1 0 14 16H2"></path></svg>;
const HumidityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 inline-block"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>;
const FeelsLikeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 inline-block"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z"></path></svg>;
const PressureIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 inline-block"><path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path></svg>;
const DaylightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 inline-block"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"></path><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>;
const AirQualityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 inline-block"><path d="M12.5 18H5.22a2 2 0 0 1-1.79-1.11L2 12l1.43-4.89a2 2 0 0 1 1.79-1.11h13.14a2 2 0 0 1 1.79 1.11L22 12l-1.43 4.89a2 2 0 0 1-1.79 1.11H17"></path><path d="M12.5 18a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"></path><path d="M17 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"></path></svg>;

// --- Helper Components ---
const Loader = () => ( <div className="text-center my-8"><svg className="animate-spin h-10 w-10 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p className="mt-2 text-slate-300">Loading data...</p></div> );
const ErrorMessage = ({ message }) => ( <div className="text-center text-yellow-300 glass-card p-4 rounded-lg mt-4 max-w-xl mx-auto"><p>Error: {message}</p></div> );

// --- getWeatherInfo ফাংশন ---
const getWeatherInfo = (code) => {
    const weatherMap = { 0: { d: "Clear sky", i: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-yellow-300"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>` }, 1: { d: "Mainly clear", i: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-white"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path><path d="M22 10a3 3 0 0 0-3-3h-2.207a5.502 5.502 0 0 0-10.702.5"></path></svg>` }, 2: { d: "Partly cloudy", i: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-white"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>` }, 3: { d: "Overcast", i: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-gray-400"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>` }, 45: { d: "Fog", i: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-gray-400"><path d="M16 16.5A4.2 4.2 0 0 0 12 12a4.2 4.2 0 0 0-4 4.5"></path><path d="M2 12h2.25"></path><path d="M19.75 12H22"></path><path d="M4 16h16"></path><path d="M4 20h16"></path><path d="M12 8V4.5"></path></svg>` }, 51: { d: "Light drizzle", i: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-blue-300"><path d="M8 19v2"></path><path d="M8 13v2"></path><path d="M16 19v2"></path><path d="M16 13v2"></path><path d="M12 21v2"></path><path d="M12 15v2"></path><path d="M20 16.5A4.5 4.5 0 0 0 15.5 12H9a7 7 0 0 0-7 7"></path></svg>` }, 61: { d: "Light rain", i: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-blue-400"><path d="M8 19v2"></path><path d="M8 13v2"></path><path d="M16 19v2"></path><path d="M16 13v2"></path><path d="M12 21v2"></path><path d="M12 15v2"></path><path d="M20 16.5A4.5 4.5 0 0 0 15.5 12H9a7 7 0 0 0-7 7"></path></svg>` }, 80: { d: "Rain showers", i: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-blue-500"><path d="M20 16.5A4.5 4.5 0 0 0 15.5 12H9a7 7 0 0 0-7 7"></path><path d="m9 12-2-7h10l-2 7"></path><path d="m12 22 2-7"></path><path d="m8 22 2-7"></path><path d="m16 22 2-7"></path></svg>` }, 95: { d: "Thunderstorm", i: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-yellow-500"><path d="M21.74 18.25a2.12 2.12 0 0 0-2.92 0c-1.88 2.3-5.28 3.75-9.82 3.75-5.28 0-10-2.5-10-2.5.83 2.17 4.25 3.75 9 3.75 6.5 0 10-2.5 12-5 1.4-1.68 1.4-3.5 0-5Z"></path><path d="M16 12.5a4.2 4.2 0 0 0-4-4.5 4.2 4.2 0 0 0-4 4.5c0 2.21 1.79 4 4 4s4-1.79 4-4Z"></path><path d="m14.5 12.5-3 5.5"></path><path d="m9.5 12.5 3 5.5"></path><path d="m13 10-1.5-5.5"></path><path d="m8 10 1.5-5.5"></path></svg>` }, };
    const defaultWeather = { d: "Cloudy", i: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-white"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>` };
    const key = Object.keys(weatherMap).find(k => Number(k) >= code);
    return weatherMap[key] || defaultWeather;
};

// --- Helper ফাংশন ---
const getAqiInfo = (aqi) => { if (aqi <= 50) return { level: 'Good', color: 'bg-green-500' }; if (aqi <= 100) return { level: 'Moderate', color: 'bg-yellow-500' }; if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500' }; if (aqi <= 200) return { level: 'Unhealthy', color: 'bg-red-500' }; if (aqi <= 300) return { level: 'Very Unhealthy', color: 'bg-purple-500' }; return { level: 'Hazardous', color: 'bg-red-700' }; };
const getWindDirection = (degrees) => { const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']; return directions[Math.round(degrees / 22.5) % 16]; };

// --- নতুন এবং উন্নত SunPath কম্পোনেন্ট ---
const SunPathComponent = ({ sunrise, sunset }) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const { sunPosition, daylightPercentage } = useMemo(() => {
        const sunriseTime = new Date(sunrise).getTime();
        const sunsetTime = new Date(sunset).getTime();
        const nowTime = now.getTime();

        if (nowTime < sunriseTime || nowTime > sunsetTime) {
            return { sunPosition: nowTime < sunriseTime ? 0 : 100, daylightPercentage: 0 };
        }

        const totalDaylight = sunsetTime - sunriseTime;
        const elapsed = nowTime - sunriseTime;
        const percentage = (elapsed / totalDaylight) * 100;
        
        return { sunPosition: percentage, daylightPercentage: percentage };
    }, [sunrise, sunset, now]);

    return (
        <div className="relative w-full max-w-sm mx-auto text-center">
            <svg viewBox="0 45 100 50" className="w-full h-auto overflow-visible">
                {/* Background dashed path */}
                <path d="M 5 90 A 45 45 0 0 1 95 90" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" fill="none" strokeDasharray="4, 4" />
                
                {/* Progress path - শুধুমাত্র দিনের আলো থাকলে দেখাবে */}
                {daylightPercentage > 0 &&
                    <path d="M 5 90 A 45 45 0 0 1 95 90" stroke="rgba(251, 191, 36, 1)" strokeWidth="2" fill="none" 
                        style={{ 
                            strokeDasharray: 141.4, 
                            strokeDashoffset: 141.4 * (1 - sunPosition / 100) 
                        }} />
                }
                
                {/* হলুদ আইকনটি এখান থেকে সরিয়ে দেওয়া হয়েছে */}

            </svg>
            
            <div className="flex justify-between font-semibold text-sm -mt-4 px-1">
                <div className="text-left">
                    <p className="text-slate-300 text-xs sm:text-sm">Sunrise</p>
                    <p>{new Date(sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="text-right">
                    <p className="text-slate-300 text-xs sm:text-sm">Sunset</p>
                    <p>{new Date(sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            </div>

            <p className="mt-4 font-medium text-sm">
                {now > new Date(sunset) ? "Sun has set" : (now < new Date(sunrise) ? "Sun will rise soon" : "Daylight Progress")}
            </p>
        </div>
    );
};

const Home = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [airQualityData, setAirQualityData] = useState(null);
    const [locationInfo, setLocationInfo] = useState(null);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const css = `
            body { color: #ffffff; font-family: 'Inter', sans-serif; }
            .main-bg::before { content: ''; position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background-image: url('https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=2565&auto=format&fit=crop'); background-size: cover; background-position: center; z-index: -1; filter: brightness(0.7); }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
            .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
            .glass-card { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); }
            .custom-scrollbar::-webkit-scrollbar { height: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 10px; }
        `;
        const styleElement = document.createElement('style');
        styleElement.innerHTML = css;
        document.head.appendChild(styleElement);
        return () => document.head.removeChild(styleElement);
    }, []);

    const fetchAPI = async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Could not fetch data. Please check your connection or the city name.`);
        return response.json();
    };

    const fetchWeather = async ({ city = null, coords = null }) => {
        setLoading(true); setError(null); setWeatherData(null); setAirQualityData(null);
        try {
            let latitude, longitude;
            if (city) {
                const geoData = await fetchAPI(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
                if (!geoData.results?.length) throw new Error('City not found.');
                const { latitude: lat, longitude: lon, name, country } = geoData.results[0];
                latitude = lat; longitude = lon; setLocationInfo({ city: name, country });
            } else if (coords) {
                latitude = coords.latitude; longitude = coords.longitude;
                const locData = await fetchAPI(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                setLocationInfo({ city: locData.city || locData.principalSubdivision, country: locData.countryName });
            }
            
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure,wind_direction_10m&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_mean,daylight_duration&timezone=auto`;
            const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm2_5,ozone`;

            const [weather, airQuality] = await Promise.all([ fetchAPI(weatherUrl), fetchAPI(airQualityUrl) ]);

            setWeatherData(weather);
            setAirQualityData(airQuality);
            setSelectedDayIndex(0);
        } catch (err) { setError(err.message); } 
        finally { setLoading(false); }
    };

    useEffect(() => {
        const initialLoad = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeather({ coords: { latitude, longitude } });
                },
                () => {
                    fetchWeather({ city: 'Dhaka' }); 
                }
            );
        };
        initialLoad();
    }, []);

    const handleSearch = () => city.trim() && fetchWeather({ city: city.trim() });
    const handleKeyPress = (e) => e.key === 'Enter' && handleSearch();

    const { displayedWeather, hourlyForecast, aqiInfo } = useMemo(() => {
        if (!weatherData) return { displayedWeather: null, hourlyForecast: [], aqiInfo: null };

        const { daily, current, hourly } = weatherData;
        const isToday = selectedDayIndex === 0;

        const formatDuration = (seconds) => {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            return `${h}h ${m}m`;
        };

        const dpWeather = {
            date: daily.time[selectedDayIndex],
            temp: isToday ? Math.round(current.temperature_2m) : Math.round(daily.temperature_2m_max[selectedDayIndex]),
            feelsLike: isToday ? Math.round(current.apparent_temperature) : null,
            weatherCode: daily.weather_code[selectedDayIndex],
            maxTemp: Math.round(daily.temperature_2m_max[selectedDayIndex]),
            minTemp: Math.round(daily.temperature_2m_min[selectedDayIndex]),
            wind: isToday ? current.wind_speed_10m.toFixed(1) : null,
            windDirection: isToday ? getWindDirection(current.wind_direction_10m) : null,
            humidity: isToday ? current.relative_humidity_2m : null,
            pressure: isToday ? current.surface_pressure.toFixed(1) : null,
            uv: daily.uv_index_max[selectedDayIndex].toFixed(1),
            sunrise: daily.sunrise[selectedDayIndex],
            sunset: daily.sunset[selectedDayIndex],
            precipitation: daily.precipitation_probability_mean[selectedDayIndex],
            daylightDuration: formatDuration(daily.daylight_duration[selectedDayIndex]),
        };

        const now = new Date();
        const currentHourIndex = hourly.time.findIndex(timeStr => new Date(timeStr) >= now);
        const hForecast = hourly.time.slice(currentHourIndex, currentHourIndex + 24).map((time, i) => ({
            time: new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
            temp: Math.round(hourly.temperature_2m[currentHourIndex + i]),
            weatherCode: hourly.weather_code[currentHourIndex + i],
            precipitation: hourly.precipitation_probability[currentHourIndex + i]
        }));

        const aqInfo = airQualityData ? {
            value: airQualityData.current.us_aqi,
            details: getAqiInfo(airQualityData.current.us_aqi),
            pm2_5: airQualityData.current.pm2_5.toFixed(2),
            ozone: airQualityData.current.ozone.toFixed(2),
        } : null;

        return { displayedWeather: dpWeather, hourlyForecast: hForecast, aqiInfo: aqInfo };
    }, [weatherData, airQualityData, selectedDayIndex]);

    const weatherInfo = displayedWeather ? getWeatherInfo(displayedWeather.weatherCode) : null;

    return (
        <div className="main-bg">
            <main className="min-h-screen w-full p-4 sm:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex w-full max-w-lg mx-auto mb-8 glass-card rounded-full">
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} onKeyPress={handleKeyPress} placeholder="Search for a city..." className="w-full py-3 px-6 text-white bg-transparent rounded-l-full focus:outline-none placeholder-slate-300"/>
                        <button onClick={handleSearch} className="px-5 py-3 bg-white/20 text-white rounded-r-full hover:bg-white/30 transition"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
                    </div>

                    {loading && <Loader />}
                    {error && <ErrorMessage message={error} />}

                    {weatherData && displayedWeather && locationInfo && weatherInfo && (
                        <div className="animate-fade-in space-y-8">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="w-full md:w-1/2 glass-card rounded-2xl p-6 flex flex-col items-center text-center">
                                    <h2 className="text-2xl sm:text-3xl font-bold">{locationInfo.city}, {locationInfo.country}</h2>
                                    <p className="text-base text-slate-300">{new Date(displayedWeather.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                                    <div className="flex items-center my-4">
                                        <div className="w-28 h-28" dangerouslySetInnerHTML={{ __html: weatherInfo.i }} />
                                        <div className="ml-2">
                                            <p className="text-7xl font-bold">{displayedWeather.temp}°<span className="text-4xl align-top">C</span></p>
                                            {selectedDayIndex === 0 && <p className="text-sm text-slate-300 -mt-2">Feels like {displayedWeather.feelsLike}°</p>}
                                        </div>
                                    </div>
                                    <p className="text-2xl capitalize font-light">{weatherInfo.d}</p>
                                </div>
                                <div className="w-full md:w-1/2 glass-card rounded-2xl p-6">
                                    <h3 className="text-2xl font-semibold mb-5 text-center">Today's Highlights</h3>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 text-lg">
                                        {[ { label: 'UV Index', value: displayedWeather.uv, Icon: UvIcon }, { label: 'Wind Speed', value: `${displayedWeather.wind} km/h`, Icon: WindIcon }, { label: 'Humidity', value: `${displayedWeather.humidity}%`, Icon: HumidityIcon }, { label: 'Feels Like', value: `${displayedWeather.feelsLike}°`, Icon: FeelsLikeIcon }, { label: 'Pressure', value: `${displayedWeather.pressure} hPa`, Icon: PressureIcon }, { label: 'Daylight', value: displayedWeather.daylightDuration, Icon: DaylightIcon }, ].filter(item => item.value && !item.value.includes('null')).map(item => (
                                            <div key={item.label} className="text-center p-3 rounded-lg bg-white/10">
                                                <p className="font-light text-slate-300 text-base flex items-center justify-center gap-2">{item.Icon()} {item.label}</p>
                                                <p className="font-bold text-2xl mt-1">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {selectedDayIndex === 0 && (
                                <div className="glass-card p-6 rounded-2xl">
                                    <h3 className="text-2xl font-bold mb-4">Sunrise & Sunset</h3>
                                    <SunPathComponent sunrise={displayedWeather.sunrise} sunset={displayedWeather.sunset} />
                                </div>
                            )}

                            {selectedDayIndex === 0 && (
                                <div className="glass-card p-6 rounded-2xl">
                                    <h3 className="text-2xl font-bold mb-4">Hourly Forecast</h3>
                                    <div className="overflow-x-auto custom-scrollbar">
                                        <div className="flex space-x-4 pb-2">
                                            {hourlyForecast.map((hour, index) => {
                                                const hourInfo = getWeatherInfo(hour.weatherCode);
                                                return (
                                                    <div key={index} className="p-4 rounded-xl text-center w-28 flex-shrink-0 bg-white/10">
                                                        <p className="font-semibold">{hour.time}</p>
                                                        <div className="w-12 h-12 mx-auto my-1" dangerouslySetInnerHTML={{ __html: hourInfo.i }} />
                                                        <p className="font-bold text-xl">{hour.temp}°</p>
                                                        <p className="text-sm text-slate-300 mt-1">💧 {hour.precipitation}%</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="glass-card p-6 rounded-2xl">
                                <h3 className="text-2xl font-bold mb-4">7-Day Forecast</h3>
                                <div className="overflow-x-auto custom-scrollbar">
                                    <div className="flex space-x-4 pb-2">
                                        {weatherData.daily.time.slice(0, 7).map((date, index) => {
                                            const dayInfo = getWeatherInfo(weatherData.daily.weather_code[index]);
                                            return (
                                                <div key={date} onClick={() => setSelectedDayIndex(index)} className={`p-4 rounded-xl cursor-pointer text-center w-32 flex-shrink-0 transition-all border-2 ${selectedDayIndex === index ? 'bg-white/30 border-white/50' : 'bg-white/10 border-transparent hover:bg-white/20'}`}>
                                                    <p className="font-semibold">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                                    <div className="w-12 h-12 mx-auto my-1" dangerouslySetInnerHTML={{ __html: dayInfo.i }} />
                                                    <p className="font-bold text-xl">{Math.round(weatherData.daily.temperature_2m_max[index])}°</p>
                                                    <p className="text-slate-300 text-sm">{Math.round(weatherData.daily.temperature_2m_min[index])}°</p>
                                                    <p className="text-xs text-slate-300 mt-1">💧 {weatherData.daily.precipitation_probability_mean[index]}%</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            
                            {aqiInfo && selectedDayIndex === 0 && (
                                <div className="glass-card p-6 rounded-2xl">
                                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><AirQualityIcon /> Air Quality Index</h3>
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="text-center sm:text-left">
                                            <p className={`text-2xl font-bold px-4 py-1 rounded-full ${aqiInfo.details.color} text-white`}>{aqiInfo.details.level}</p>
                                            <p className="text-slate-300 mt-2">Current US AQI is {aqiInfo.value}.</p>
                                        </div>
                                        <div className="w-full sm:w-auto text-center sm:text-right">
                                            <p className="text-lg">PM2.5: <span className="font-bold">{aqiInfo.pm2_5}</span> µg/m³</p>
                                            <p className="text-lg">Ozone (O₃): <span className="font-bold">{aqiInfo.ozone}</span> µg/m³</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;
