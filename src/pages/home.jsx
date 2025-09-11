import React, { useState, useEffect, useMemo } from 'react';

// এই লাইনটি আপনার getWeatherInfo ফাংশশনের সঠিক পাথ অনুযায়ী পরিবর্তন করুন
// ধরে নিচ্ছি এটি '../assets/weatherUtils' এর মতো কোনো ফাইলে আছে
// যেহেতু ফাইলটি দেওয়া হয়নি, আমি একটি ডামি ফাংশন তৈরি করে দিচ্ছি।
const getWeatherInfo = (code) => {
    const weatherTypes = {
        0: { d: "Clear sky", i: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-yellow-300"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>' },
        1: { d: "Mainly clear", i: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-slate-200"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>' },
        2: { d: "Partly cloudy", i: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-slate-200"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>' },
        3: { d: "Overcast", i: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-slate-400"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>' },
        45: { d: "Fog", i: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-slate-400"><path d="M16 16.5A4.2 4.2 0 0 0 12.4 8H12a5 5 0 0 0-5 5h13.5a3.5 3.5 0 0 0-3-3.5Z"></path><path d="M3 20h18"></path><path d="M3 16h1"></path></svg>' },
        61: { d: "Light rain", i: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-blue-300"><path d="M16 16.5A4.2 4.2 0 0 0 12.4 8H12a5 5 0 0 0-5 5h13.5a3.5 3.5 0 0 0-3-3.5Z"></path><path d="M8 19v1"></path><path d="M12 20v1"></path><path d="M16 19v1"></path></svg>' },
        80: { d: "Rain showers", i: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-blue-400"><path d="M16 16.5A4.2 4.2 0 0 0 12.4 8H12a5 5 0 0 0-5 5h13.5a3.5 3.5 0 0 0-3-3.5Z"></path><path d="M8 19v1"></path><path d="M12 20v1"></path><path d="M16 19v1"></path></svg>' },
    };
    return weatherTypes[code] || weatherTypes[0];
};

// --- আইকন কম্পোনেন্ট ---
const UvIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 inline-block"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a5 5 0 100-10 5 5 0 000 10z"></path></svg>;
const WindIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 inline-block"><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"></path></svg>;
const SunIcon = ({ isSunrise }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 inline-block"><path d={isSunrise ? "M17 18a5 5 0 00-10 0" : "M17 16a5 5 0 00-10 0"}></path><line x1="12" y1="9" x2="12" y2="2"></line><line x1="4.22" y1="10.22" x2="5.64" y2="8.81"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="8.81" x2="19.78" y2="10.22"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>;
const HumidityIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 inline-block"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z"></path></svg>;
const FeelsLikeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 inline-block"><path d="M14 9V5a3 3 0 00-6 0v4M17.5 11a2.5 2.5 0 110 5H10a2 2 0 110-4h2.5a2.5 2.5 0 110 5H9"></path></svg>;
const PrecipitationIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 inline-block"><path d="M16 16.5A4.2 4.2 0 0 0 12.4 8H12a5 5 0 0 0-5 5h13.5a3.5 3.5 0 0 0-3-3.5Z"></path><path d="M8 19v1"></path><path d="M12 20v1"></path><path d="M16 19v1"></path></svg>;
const PressureIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 inline-block"><path d="M21 12a9 9 0 1 1-9-9"></path><path d="M15 4.58V2a2 2 0 0 0-4 0v2.58"></path><path d="M19.42 9l2.5-2.5a2 2 0 0 0-2.82-2.82L16.58 6"></path></svg>;
const MoonIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 inline-block"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>;

// --- হেল্পার ফাংশন ---
const getAqiInfo = (aqi) => {
    if (aqi <= 50) return { level: 'Good', color: 'text-green-400' };
    if (aqi <= 100) return { level: 'Moderate', color: 'text-yellow-400' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: 'text-orange-400' };
    if (aqi <= 200) return { level: 'Unhealthy', color: 'text-red-500' };
    if (aqi <= 300) return { level: 'Very Unhealthy', color: 'text-purple-500' };
    return { level: 'Hazardous', color: 'text-maroon-500' };
};
const getMoonPhaseInfo = (phase) => {
    if (phase < 0.06) return 'New Moon';
    if (phase < 0.22) return 'Waxing Crescent';
    if (phase < 0.28) return 'First Quarter';
    if (phase < 0.47) return 'Waxing Gibbous';
    if (phase < 0.53) return 'Full Moon';
    if (phase < 0.72) return 'Waning Gibbous';
    if (phase < 0.78) return 'Last Quarter';
    return 'Waning Crescent';
};

const Loader = () => ( <div className="text-center my-8"><svg className="animate-spin h-10 w-10 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p className="mt-2 text-slate-300">Loading data...</p></div> );
const ErrorMessage = ({ message }) => ( <div className="text-center text-yellow-300 glass-card p-4 rounded-lg mt-4 max-w-xl mx-auto"><p>Error: {message}</p></div> );

const Home = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [airQuality, setAirQuality] = useState(null);
    const [locationInfo, setLocationInfo] = useState(null);
    const [coords, setCoords] = useState(null);
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
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.reason || `API request failed with status ${response.status}`);
        }
        return response.json();
    };

    const fetchWeather = async ({ city = null, coords = null }) => {
        setLoading(true);
        setError(null);
        // আগের ডেটা লোড করার সময় দেখানো হবে, তাই null করা হচ্ছে না
        // setWeatherData(null); 
        // setAirQuality(null);

        try {
            let latitude, longitude;
            let locInfo = {};

            if (city) {
                const geoData = await fetchAPI(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
                if (!geoData.results?.length) throw new Error(`Could not find the city '${city}'. Please check the spelling.`);
                const { latitude: lat, longitude: lon, name, country } = geoData.results[0];
                latitude = lat; longitude = lon;
                locInfo = { city: name, country };
            } else if (coords) {
                latitude = coords.latitude; longitude = coords.longitude;
                const locData = await fetchAPI(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                locInfo = { city: locData.city || locData.principalSubdivision, country: locData.countryName };
            }
            
            // আবশ্যিক আবহাওয়ার ডেটা আনা হচ্ছে
            const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,moonrise,moonset,moon_phase&timezone=auto`;
            const weather = await fetchAPI(weatherURL);
            
            setWeatherData(weather);
            setLocationInfo(locInfo);
            setCoords({ lat: latitude, lon: longitude });
            setSelectedDayIndex(0);
            
            // অতিরিক্ত ডেটা: বাতাসের গুণমান (এটি ফেইল হলেও অ্যাপ চলবে)
            try {
                const airQualityURL = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi`;
                const airQualityData = await fetchAPI(airQualityURL);
                setAirQuality(airQualityData);
            } catch (aqError) {
                console.error("Failed to fetch air quality data:", aqError.message);
                setAirQuality(null); // ব্যর্থ হলে ডেটা রিসেট করা হচ্ছে
            }

        } catch (err) {
            setError(err.message);
            setWeatherData(null);
            setAirQuality(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initialLoad = async () => {
            try {
                const data = await fetchAPI('https://ipinfo.io/json');
                const [latitude, longitude] = data.loc.split(',');
                await fetchWeather({ coords: { latitude, longitude } });
            } catch (error) {
                console.error("IP based location failed, falling back to default city.", error);
                await fetchWeather({ city: 'Dhaka' });
            }
        };
        initialLoad();
    }, []);

    const handleSearch = () => city.trim() && fetchWeather({ city: city.trim() });
    const handleKeyPress = (e) => e.key === 'Enter' && handleSearch();

    const { displayedWeather, hourlyForecast } = useMemo(() => {
        if (!weatherData) return { displayedWeather: null, hourlyForecast: [] };

        const { daily, current, hourly } = weatherData;
        const isToday = selectedDayIndex === 0;

        const dpWeather = {
            date: daily.time[selectedDayIndex],
            temp: isToday ? Math.round(current.temperature_2m) : Math.round(daily.temperature_2m_max[selectedDayIndex]),
            feelsLike: isToday ? Math.round(current.apparent_temperature) : null,
            weatherCode: daily.weather_code[selectedDayIndex],
            maxTemp: Math.round(daily.temperature_2m_max[selectedDayIndex]),
            minTemp: Math.round(daily.temperature_2m_min[selectedDayIndex]),
            wind: isToday ? current.wind_speed_10m.toFixed(1) : null,
            humidity: isToday ? current.relative_humidity_2m : null,
            uv: daily.uv_index_max[selectedDayIndex].toFixed(1),
            sunrise: new Date(daily.sunrise[selectedDayIndex]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
            sunset: new Date(daily.sunset[selectedDayIndex]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
            precipitation: daily.precipitation_probability_max[selectedDayIndex],
            pressure: isToday ? current.pressure_msl.toFixed(0) : null,
            moonrise: daily.moonrise[selectedDayIndex] ? new Date(daily.moonrise[selectedDayIndex]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A',
            moonset: daily.moonset[selectedDayIndex] ? new Date(daily.moonset[selectedDayIndex]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A',
            moonPhase: getMoonPhaseInfo(daily.moon_phase[selectedDayIndex]),
        };

        const now = new Date();
        const currentHourIndex = hourly.time.findIndex(timeStr => new Date(timeStr) >= now);
        const hForecast = hourly.time.slice(currentHourIndex, currentHourIndex + 24).map((time, i) => ({
            time: new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
            temp: Math.round(hourly.temperature_2m[currentHourIndex + i]),
            weatherCode: hourly.weather_code[currentHourIndex + i],
        }));

        return { displayedWeather: dpWeather, hourlyForecast: hForecast };
    }, [weatherData, selectedDayIndex]);

    const weatherInfo = displayedWeather ? getWeatherInfo(displayedWeather.weatherCode) : null;
    const aqiInfo = airQuality ? getAqiInfo(airQuality.current.us_aqi) : null;

    return (
        <div className="main-bg">
            <main className="min-h-screen w-full p-4 sm:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    {/* -- Search Bar -- */}
                    <div className="flex w-full max-w-lg mx-auto mb-8 glass-card rounded-full">
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} onKeyPress={handleKeyPress} placeholder="Search for a city..." className="w-full py-3 px-6 text-white bg-transparent rounded-l-full focus:outline-none placeholder-slate-300"/>
                        <button onClick={handleSearch} disabled={loading} className="px-5 py-3 bg-white/20 text-white rounded-r-full hover:bg-white/30 transition disabled:opacity-50"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
                    </div>

                    {loading && <Loader />}
                    {error && !loading && <ErrorMessage message={error} />}

                    {weatherData && displayedWeather && locationInfo && weatherInfo && (
                        <div className="animate-fade-in space-y-8">
                            {/* -- Main Weather Section -- */}
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="w-full md:w-1/2 lg:w-2/5 glass-card rounded-2xl p-6 flex flex-col items-center text-center">
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
                                <div className="hidden md:block w-full md:w-1/2 lg:w-3/5 glass-card rounded-2xl p-6">
                                    <h3 className="text-2xl font-semibold mb-5 text-center">Today's Highlights</h3>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 text-lg">
                                        {[
                                            { label: 'UV Index', value: displayedWeather.uv, Icon: UvIcon },
                                            { label: 'Wind Speed', value: `${displayedWeather.wind} km/h`, Icon: WindIcon },
                                            { label: 'Sunrise', value: displayedWeather.sunrise, Icon: () => <SunIcon isSunrise /> },
                                            { label: 'Sunset', value: displayedWeather.sunset, Icon: () => <SunIcon isSunrise={false} /> },
                                            { label: 'Humidity', value: `${displayedWeather.humidity}%`, Icon: HumidityIcon },
                                            { label: 'Pressure', value: `${displayedWeather.pressure} hPa`, Icon: PressureIcon },
                                            { label: 'Precipitation', value: `${displayedWeather.precipitation}%`, Icon: PrecipitationIcon },
                                            { label: 'Moonrise', value: displayedWeather.moonrise, Icon: MoonIcon },
                                            { label: 'Moonset', value: displayedWeather.moonset, Icon: () => <MoonIcon className="transform -scale-y-100"/> },
                                        ].filter(item => item.value && !String(item.value).includes('null') && item.value !== 'N/A').map(item => (
                                            <div key={item.label} className="text-center p-3 rounded-lg bg-white/10">
                                                <p className="font-light text-slate-300 text-base flex items-center justify-center gap-2">{item.Icon()} {item.label}</p>
                                                <p className="font-bold text-xl xl:text-2xl mt-1">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="block md:hidden glass-card rounded-2xl p-6">
                                <h3 className="text-2xl font-semibold mb-5 text-center">Today's Highlights</h3>
                                <div className="grid grid-cols-2 gap-5 text-lg">
                                    {[
                                         { label: 'UV Index', value: displayedWeather.uv, Icon: UvIcon },
                                         { label: 'Wind Speed', value: `${displayedWeather.wind} km/h`, Icon: WindIcon },
                                         { label: 'Humidity', value: `${displayedWeather.humidity}%`, Icon: HumidityIcon },
                                         { label: 'Precipitation', value: `${displayedWeather.precipitation}%`, Icon: PrecipitationIcon },
                                    ].filter(item => item.value && !String(item.value).includes('null')).map(item => (
                                        <div key={item.label} className="text-center p-2 rounded-lg bg-white/10">
                                            <p className="font-light text-slate-300 text-sm flex items-center justify-center gap-2">{item.Icon()} {item.label}</p>
                                            <p className="font-bold text-xl mt-1">{item.value}</p>
                                        </div>
                                    ))}
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
                                                    <div key={index} className="p-4 rounded-xl text-center w-24 flex-shrink-0 bg-white/10">
                                                        <p className="font-semibold">{hour.time}</p>
                                                        <div className="w-12 h-12 mx-auto my-2" dangerouslySetInnerHTML={{ __html: hourInfo.i }} />
                                                        <p className="font-bold text-xl">{hour.temp}°</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {aqiInfo && selectedDayIndex === 0 && (
                                     <div className="glass-card p-6 rounded-2xl">
                                        <h3 className="text-2xl font-bold mb-4">Air Quality</h3>
                                        <div className="flex items-center justify-around text-center">
                                            <div>
                                                <p className="text-6xl font-bold">{airQuality.current.us_aqi}</p>
                                                <p className="text-slate-300">US AQI</p>
                                            </div>
                                            <div>
                                                <p className={`text-2xl font-semibold ${aqiInfo.color}`}>{aqiInfo.level}</p>
                                                <p className="text-slate-300 mt-1">Current air quality is {aqiInfo.level.toLowerCase()}.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="glass-card p-6 rounded-2xl">
                                    <h3 className="text-2xl font-bold mb-4">Weather Map</h3>
                                    {coords && (
                                        <iframe
                                            title="Weather Map"
                                            width="100%"
                                            height="250"
                                            className="rounded-lg"
                                            frameBorder="0"
                                            src={`https://embed.windy.com/embed2.html?lat=${coords.lat}&lon=${coords.lon}&zoom=7&level=surface&overlay=wind&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=kmh&metricTemp=%C2%B0C&radarRange=-1`}>
                                        </iframe>
                                    )}
                                </div>
                            </div>

                            <div className="glass-card p-6 rounded-2xl">
                                <h3 className="text-2xl font-bold mb-4">7-Day Forecast</h3>
                                <div className="overflow-x-auto custom-scrollbar">
                                    <div className="flex space-x-4 pb-2">
                                        {weatherData.daily.time.slice(0, 7).map((date, index) => {
                                            const dayInfo = getWeatherInfo(weatherData.daily.weather_code[index]);
                                            return (
                                                <div key={date} onClick={() => setSelectedDayIndex(index)} className={`p-4 rounded-xl cursor-pointer text-center w-28 flex-shrink-0 transition-all border-2 ${selectedDayIndex === index ? 'bg-white/30 border-white/50' : 'bg-white/10 border-transparent hover:bg-white/20'}`}>
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
