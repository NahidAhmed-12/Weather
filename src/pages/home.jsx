import React, { useState, useEffect, useMemo } from 'react';
// এই লাইনটি আপনার getWeatherInfo ফাংশশনের সঠিক পাথ অনুযায়ী পরিবর্তন করুন
import { getWeatherInfo } from '../assets/icons';

// --- আইকন কম্পোনেন্টগুলো ---
const WindIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 inline-block"><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"></path></svg>;
const SunIcon = ({ isSunrise }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 inline-block"><path d={isSunrise ? "M17 18a5 5 0 00-10 0" : "M17 16a5 5 0 00-10 0"}></path><line x1="12" y1="9" x2="12" y2="2"></line><line x1="4.22" y1="10.22" x2="5.64" y2="8.81"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="8.81" x2="19.78" y2="10.22"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>;
const HumidityIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 inline-block"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z"></path></svg>;
// --- নতুন আইকন ---
const AirQualityIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 inline-block"><path d="M12 8V4H8a4 4 0 00-4 4v4h4m4-4h4a4 4 0 014 4v4h-4m-4 4v4h4a4 4 0 004-4v-4h-4"></path></svg>;
const MoonIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 inline-block"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 4 4 0 000 8 4 4 0 000 8z"></path></svg>;

const Loader = () => ( <div className="text-center my-8"><svg className="animate-spin h-10 w-10 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p className="mt-2 text-slate-300">Loading data...</p></div> );
const ErrorMessage = ({ message }) => ( <div className="text-center text-yellow-300 glass-card p-4 rounded-lg mt-4 max-w-xl mx-auto"><p>Error: {message}</p></div> );

const Home = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [locationInfo, setLocationInfo] = useState(null);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const css = `
            body { color: #ffffff; font-family: 'Inter', sans-serif; }
            .main-bg::before { content: ''; position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background-image: url('https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=2565&auto-format&fit=crop'); background-size: cover; background-position: center; z-index: -1; filter: brightness(0.7); }
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
        if (!response.ok) throw new Error(`Could not find the city. Please check the spelling.`);
        return response.json();
    };

    const fetchWeather = async ({ city = null, coords = null }) => {
        setLoading(true); setError(null); setWeatherData(null);
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
            
            // --- নতুন ফিচার: API URL-এ air_quality এবং moon_phase যোগ করা হয়েছে ---
            const weather = await fetchAPI(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,moon_phase&timezone=auto&current_weather=true&air_quality=pm2_5`);
            
            // Air Quality API কল
            const airQualityData = await fetchAPI(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi`);

            setWeatherData({ ...weather, airQuality: airQualityData });
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
            } catch (error) { await fetchWeather({ city: 'Dhaka' }); }
        };
        initialLoad();
    }, []);

    const handleSearch = () => city.trim() && fetchWeather({ city: city.trim() });
    const handleKeyPress = (e) => e.key === 'Enter' && handleSearch();

    // -- ডেটা প্রসেসিং --
    const { displayedWeather, hourlyForecast, airQuality, moonPhase } = useMemo(() => {
        if (!weatherData) return { displayedWeather: null, hourlyForecast: [], airQuality: null, moonPhase: null };

        const { daily, current, hourly, airQuality: aqData } = weatherData;
        const isToday = selectedDayIndex === 0;

        const dpWeather = {
            date: daily.time[selectedDayIndex],
            temp: Math.round(isToday ? current.temperature_2m : daily.temperature_2m_max[selectedDayIndex]),
            feelsLike: isToday ? Math.round(current.apparent_temperature) : null,
            weatherCode: daily.weather_code[selectedDayIndex],
            maxTemp: Math.round(daily.temperature_2m_max[selectedDayIndex]),
            minTemp: Math.round(daily.temperature_2m_min[selectedDayIndex]),
            wind: isToday ? current.wind_speed_10m.toFixed(1) : null,
            humidity: isToday ? current.relative_humidity_2m : null,
            sunrise: new Date(daily.sunrise[selectedDayIndex]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
            sunset: new Date(daily.sunset[selectedDayIndex]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        };
        
        const now = new Date();
        const currentHourIndex = hourly.time.findIndex(timeStr => new Date(timeStr) >= now);
        const hForecast = hourly.time.slice(currentHourIndex, currentHourIndex + 24).map((time, i) => ({
            time: new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
            temp: Math.round(hourly.temperature_2m[currentHourIndex + i]),
            weatherCode: hourly.weather_code[currentHourIndex + i],
        }));

        // --- নতুন ফিচার: Air Quality ডেটা প্রসেসিং ---
        const getAqiInfo = (aqi) => {
            if (aqi <= 50) return { level: "Good", color: "text-green-400" };
            if (aqi <= 100) return { level: "Moderate", color: "text-yellow-400" };
            if (aqi <= 150) return { level: "Unhealthy for Sensitive", color: "text-orange-400" };
            return { level: "Unhealthy", color: "text-red-500" };
        };
        const aq = aqData?.current?.european_aqi ? getAqiInfo(aqData.current.european_aqi) : null;

        // --- নতুন ফিচার: Moon Phase ডেটা প্রসেসিং ---
        const getMoonPhaseInfo = (phase) => {
            if (phase < 0.1) return "New Moon"; if (phase < 0.25) return "Waxing Crescent"; if (phase < 0.3) return "First Quarter";
            if (phase < 0.5) return "Waxing Gibbous"; if (phase < 0.55) return "Full Moon"; if (phase < 0.75) return "Waning Gibbous";
            if (phase < 0.8) return "Last Quarter"; return "Waning Crescent";
        }
        const mp = daily?.moon_phase?.[selectedDayIndex] ? getMoonPhaseInfo(daily.moon_phase[selectedDayIndex]) : null;

        return { displayedWeather: dpWeather, hourlyForecast: hForecast, airQuality: aq, moonPhase: mp };
    }, [weatherData, selectedDayIndex]);

    const weatherInfo = displayedWeather ? getWeatherInfo(displayedWeather.weatherCode) : null;

    return (
        <div className="main-bg">
            <main className="min-h-screen w-full p-4 sm:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    {/* -- Search Bar -- */}
                    <div className="flex w-full max-w-lg mx-auto mb-8 glass-card rounded-full">
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} onKeyPress={handleKeyPress} placeholder="Search for a city..." className="w-full py-3 px-6 text-white bg-transparent rounded-l-full focus:outline-none placeholder-slate-300"/>
                        <button onClick={handleSearch} className="px-5 py-3 bg-white/20 text-white rounded-r-full hover:bg-white/30 transition"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
                    </div>

                    {loading && <Loader />}
                    {error && <ErrorMessage message={error} />}

                    {weatherData && displayedWeather && locationInfo && weatherInfo && (
                        <div className="animate-fade-in space-y-8">
                            {/* -- Main Weather & Highlights -- */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center">
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
                                <div className="glass-card rounded-2xl p-6">
                                    <h3 className="text-2xl font-semibold mb-5 text-center">Today's Highlights</h3>
                                    <div className="grid grid-cols-2 gap-5 text-lg">
                                        {[ { label: 'Sunrise', value: displayedWeather.sunrise, Icon: () => <SunIcon isSunrise /> }, { label: 'Sunset', value: displayedWeather.sunset, Icon: () => <SunIcon isSunrise={false} /> }, { label: 'Wind Speed', value: `${displayedWeather.wind} km/h`, Icon: WindIcon }, { label: 'Humidity', value: `${displayedWeather.humidity}%`, Icon: HumidityIcon } ].filter(item => !String(item.value).includes('null')).map(item => ( <div key={item.label} className="text-center p-3 rounded-lg bg-white/10"><p className="font-light text-slate-300 text-base flex items-center justify-center gap-2">{item.Icon()} {item.label}</p><p className="font-bold text-xl md:text-2xl mt-1">{item.value}</p></div> ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* -- Hourly Forecast -- */}
                            {selectedDayIndex === 0 && (
                                <div className="glass-card p-6 rounded-2xl">
                                    <h3 className="text-2xl font-bold mb-4">Hourly Forecast</h3>
                                    <div className="overflow-x-auto custom-scrollbar">
                                        <div className="flex space-x-4 pb-2">
                                            {hourlyForecast.map((hour, index) => {
                                                const hourInfo = getWeatherInfo(hour.weatherCode);
                                                return ( <div key={index} className="p-4 rounded-xl text-center w-24 flex-shrink-0 bg-white/10"><p className="font-semibold">{hour.time}</p><div className="w-12 h-12 mx-auto my-2" dangerouslySetInnerHTML={{ __html: hourInfo.i }} /><p className="font-bold text-xl">{hour.temp}°</p></div> );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- নতুন ফিচার: Air Quality & Moon Phase Section --- */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {airQuality && selectedDayIndex === 0 && (
                                    <div className="glass-card rounded-2xl p-6">
                                        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2"><AirQualityIcon /> Air Quality</h3>
                                        <p className="text-4xl font-bold">{weatherData.airQuality.current.european_aqi} <span className={`text-2xl ${airQuality.color}`}>{airQuality.level}</span></p>
                                        <p className="text-slate-300 mt-2">European AQI. Main pollutant: PM2.5</p>
                                    </div>
                                )}
                                {moonPhase && (
                                    <div className="glass-card rounded-2xl p-6">
                                        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2"><MoonIcon /> Moon Phase</h3>
                                        <p className="text-4xl font-bold">{moonPhase}</p>
                                        <p className="text-slate-300 mt-2">{new Date(displayedWeather.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                                    </div>
                                )}
                            </div>

                            {/* -- 7-Day Forecast -- */}
                            <div className="glass-card p-6 rounded-2xl">
                                <h3 className="text-2xl font-bold mb-4">7-Day Forecast</h3>
                                <div className="overflow-x-auto custom-scrollbar">
                                    <div className="flex space-x-4 pb-2">
                                        {weatherData.daily.time.slice(0, 7).map((date, index) => {
                                            const dayInfo = getWeatherInfo(weatherData.daily.weather_code[index]);
                                            return ( <div key={date} onClick={() => setSelectedDayIndex(index)} className={`p-4 rounded-xl cursor-pointer text-center w-28 flex-shrink-0 transition-all border-2 ${selectedDayIndex === index ? 'bg-white/30 border-white/50' : 'bg-white/10 border-transparent hover:bg-white/20'}`}><p className="font-semibold">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</p><div className="w-12 h-12 mx-auto my-2" dangerouslySetInnerHTML={{ __html: dayInfo.i }} /><p className="font-bold text-xl">{Math.round(weatherData.daily.temperature_2m_max[index])}°</p><p className="text-slate-300">{Math.round(weatherData.daily.temperature_2m_min[index])}°</p></div> );
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
