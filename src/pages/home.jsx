import React, { useState, useEffect, useMemo } from 'react';

// --- আইকন কম্পোনেন্টগুলো ---
const UvIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 inline-block"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>;
const WindIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 inline-block"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"></path><path d="M9.6 4.6A2 2 0 1 1 11 8H2"></path><path d="M12.6 19.4A2 2 0 1 0 14 16H2"></path></svg>;
const HumidityIcon = () => <svg xmlns="http://www.w.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 inline-block"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>;
const FeelsLikeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 inline-block"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z"></path></svg>;
const PressureIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 inline-block"><path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path></svg>;
const DaylightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 inline-block"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"></path><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>;
const AirQualityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 inline-block"><path d="M12.5 18H5.22a2 2 0 0 1-1.79-1.11L2 12l1.43-4.89a2 2 0 0 1 1.79-1.11h13.14a2 2 0 0 1 1.79 1.11L22 12l-1.43 4.89a2 2 0 0 1-1.79 1.11H17"></path><path d="M12.5 18a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"></path><path d="M17 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"></path></svg>;

// --- নতুন Sun এবং Moon আইকন ---
const SunIcon = () => (
    <g>
        <circle cx="0" cy="0" r="6" fill="#FBBF24" />
        <circle cx="0" cy="0" r="9" fill="#FBBF24" fillOpacity="0.3" />
    </g>
);
const MoonIcon = () => (
    <g transform="translate(-2, -2)">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#E2E8F0" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    </g>
);

// --- Helper Components ---
const Loader = () => ( <div className="text-center my-8"><svg className="animate-spin h-10 w-10 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p className="mt-2 text-slate-300">Loading data...</p></div> );
const ErrorMessage = ({ message }) => ( <div className="text-center text-yellow-300 glass-card p-4 rounded-lg mt-4 max-w-xl mx-auto"><p>Error: {message}</p></div> );

// --- getWeatherInfo ফাংশন ---
const getWeatherInfo = (code) => {
const weatherMap = { 0: { d: "Clear sky", i: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-yellow-300"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> }, 1: { d: "Mainly clear", i: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-white"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path><path d="M22 10a3 3 0 0 0-3-3h-2.207a5.502 5.502 0 0 0-10.702.5"></path></svg> }, 2: { d: "Partly cloudy", i: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-white"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg> }, 3: { d: "Overcast", i: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-gray-400"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg> }, 45: { d: "Fog", i: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-gray-400"><path d="M16 16.5A4.2 4.2 0 0 0 12 12a4.2 4.2 0 0 0-4 4.5"></path><path d="M2 12h2.25"></path><path d="M19.75 12H22"></path><path d="M4 16h16"></path><path d="M4 20h16"></path><path d="M12 8V4.5"></path></svg> }, 51: { d: "Light drizzle", i: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-blue-300"><path d="M8 19v2"></path><path d="M8 13v2"></path><path d="M16 19v2"></path><path d="M16 13v2"></path><path d="M12 21v2"></path><path d="M12 15v2"></path><path d="M20 16.5A4.5 4.5 0 0 0 15.5 12H9a7 7 0 0 0-7 7"></path></svg> }, 61: { d: "Light rain", i: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-blue-400"><path d="M8 19v2"></path><path d="M8 13v2"></path><path d="M16 19v2"></path><path d="M16 13v2"></path><path d="M12 21v2"></path><path d="M12 15v2"></path><path d="M20 16.5A4.5 4.5 0 0 0 15.5 12H9a7 7 0 0 0-7 7"></path></svg> }, 80: { d: "Rain showers", i: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-blue-500"><path d="M20 16.5A4.5 4.5 0 0 0 15.5 12H9a7 7 0 0 0-7 7"></path><path d="m9 12-2-7h10l-2 7"></path><path d="m12 22 2-7"></path><path d="m8 22 2-7"></path><path d="m16 22 2-7"></path></svg> }, 
95: { d: "Thunderstorm", i: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-yellow-500"><path d="M21 16.9231V12.5C21 8.35786 17.6421 5 13.5 5C9.69139 5 6.63484 7.82471 6.13453 11.5H6C3.79086 11.5 2 13.2909 2 15.5C2 17.7091 3.79086 19.5 6 19.5H12"/><path d="M13 15L11 19L15 19L13 23"/></svg> }, };
const defaultWeather = { d: "Cloudy", i: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-white"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg> };
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
        const timer = setInterval(() => setNow(new Date()), 60000); // প্রতি মিনিটে আপডেট
        return () => clearInterval(timer);
    }, []);

    const { position, isDay } = useMemo(() => {
        const sunriseTime = new Date(sunrise).getTime();
        const sunsetTime = new Date(sunset).getTime();
        const nowTime = now.getTime();

        const isCurrentlyDay = nowTime >= sunriseTime && nowTime <= sunsetTime;

        if (isCurrentlyDay) {
            const totalDaylight = sunsetTime - sunriseTime;
            const elapsed = nowTime - sunriseTime;
            const percentage = (elapsed / totalDaylight) * 100;
            return { position: percentage, isDay: true };
        } else {
             // রাতের বেলায় চাঁদের অবস্থান দেখানোর জন্য একটি সিম্পল লজিক
            const midnight = new Date(now).setHours(0, 0, 0, 0);
            const totalNight = (sunriseTime - midnight) + (new Date(sunset).setHours(24,0,0,0) - sunsetTime);
            let elapsedNight;

            if (nowTime < sunriseTime) { // ভোরের আগের রাত
                elapsedNight = nowTime - (new Date(sunset).getTime() - 24 * 60 * 60 * 1000);
            } else { // সূর্যাস্তের পরের রাত
                elapsedNight = nowTime - sunsetTime;
            }
            
            const nightPercentage = Math.min(100, (elapsedNight / (totalNight * 0.5)) * 100);
            return { position: nightPercentage, isDay: false };
        }

    }, [sunrise, sunset, now]);

    const angle = (position / 100) * 180;
    const x = 50 - 45 * Math.cos(angle * (Math.PI / 180));
    const y = 90 - 45 * Math.sin(angle * (Math.PI / 180));

    return (
        <div className="relative w-full max-w-sm mx-auto text-center">
            <svg viewBox="0 45 100 50" className="w-full h-auto overflow-visible">
                {/* Path for day and night */}
                <path d="M 5 90 A 45 45 0 0 1 95 90" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" fill="none" strokeDasharray="4, 4" />
                
                {/* Filled path based on sun/moon position */}
                <path d="M 5 90 A 45 45 0 0 1 95 90" 
                    stroke={isDay ? "rgba(251, 191, 36, 1)" : "rgba(226, 232, 240, 0.8)"} 
                    strokeWidth="2" 
                    fill="none"
                    style={{
                        strokeDasharray: 141.4,
                        strokeDashoffset: 141.4 * (1 - position / 100)
                    }} 
                />
                
                <g transform={`translate(${x}, ${y})`}>
                    {isDay ? <SunIcon /> : <MoonIcon />}
                </g>

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
                {isDay ? "Current Sun Position" : "Current Moon Position"}
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
const css = `body { color: #ffffff; font-family: 'Inter', sans-serif; } .main-bg::before { content: ''; position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background-image: url('https://images.pexels.com/photos/9536498/pexels-photo-9536498.jpeg'); background-size: cover; background-position: center; z-index: -1; filter: brightness(0.6); } @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; } .glass-card { background: rgba(0, 0, 0, 0.2); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); } .custom-scrollbar::-webkit-scrollbar { height: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 10px; }`;
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

if (coords) {
    latitude = coords.latitude; 
    longitude = coords.longitude;
    const locData = await fetchAPI(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
    setLocationInfo({ city: locData.city || locData.principalSubdivision, country: locData.countryName });
} else if (city) {
    const geoData = await fetchAPI(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    if (!geoData.results?.length) throw new Error('City not found.');
    const { latitude: lat, longitude: lon, name, country } = geoData.results[0];
    latitude = lat; longitude = lon; setLocationInfo({ city: name, country });
}

if(!latitude || !longitude) throw new Error('Could not determine location.');

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
    const initialLoad = async () => {
        try {
            // আইপি থেকে লোকেশন পাওয়ার চেষ্টা
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            if (data && data.latitude && data.longitude) {
                fetchWeather({ coords: { latitude: data.latitude, longitude: data.longitude } });
            } else {
                // লোকেশন না পেলে ঢাকা ডিফল্ট হিসেবে সেট করা হবে
                fetchWeather({ city: 'Dhaka' });
            }
        } catch (error) {
            console.error("Error fetching IP-based location, falling back to default.", error);
            fetchWeather({ city: 'Dhaka' });
        }
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
                            <div className="w-28 h-28">{weatherInfo.i}</div>
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
                        <h3 className="text-2xl font-bold mb-4">Hourly Forecast</h3>
                        <div className="overflow-x-auto custom-scrollbar">
                            <div className="flex space-x-4 pb-2">
                                {hourlyForecast.map((hour, index) => {
                                    const hourInfo = getWeatherInfo(hour.weatherCode);
                                    return (
                                        <div key={index} className="p-4 rounded-xl text-center w-28 flex-shrink-0 bg-white/10">
                                            <p className="font-semibold">{hour.time}</p>
                                            <div className="w-12 h-12 mx-auto my-1">{hourInfo.i}</div>
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
                                        <div className="w-12 h-12 mx-auto my-1">{dayInfo.i}</div>
                                        <p className="font-bold text-xl">{Math.round(weatherData.daily.temperature_2m_max[index])}°</p>
                                        <p className="text-slate-300 text-sm">{Math.round(weatherData.daily.temperature_2m_min[index])}°</p>
                                        <p className="text-xs text-slate-300 mt-1">💧 {weatherData.daily.precipitation_probability_mean[index]}%</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {selectedDayIndex === 0 && (
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="text-2xl font-bold mb-4">Sunrise & Sunset</h3>
                        <SunPathComponent sunrise={displayedWeather.sunrise} sunset={displayedWeather.sunset} />
                    </div>
                )}
                
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
