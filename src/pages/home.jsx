import React, 'react';
import {
    Sun, Thermometer, Wind, Droplets, Gauge, Compass, Waves, SunDim, CloudSun, Moon,
    Cloud, CloudDrizzle, CloudRain, Cloudy, Haze, CloudLightning, Snowflake, Tornado, Search, CloudFog, Sunrise, Sunset
} from 'lucide-react';

// --- আইকন কম্পোনেন্টগুলো (Lucide React থেকে) ---
const UvIcon = () => <Sun size={20} className="inline-block" />;
const WindIcon = () => <Wind size={20} className="inline-block" />;
const HumidityIcon = () => <Droplets size={20} className="inline-block" />;
const FeelsLikeIcon = () => <Thermometer size={20} className="inline-block" />;
const PressureIcon = () => <Gauge size={20} className="inline-block" />;
const WindDirectionIcon = () => <Compass size={20} className="inline-block" />;
const AirQualityIcon = () => <Waves size={20} className="inline-block" />;
const DaylightIcon = () => <SunDim size={20} className="inline-block" />;

// --- Helper Components ---
const Loader = () => ( <div className="text-center my-8"><svg className="animate-spin h-10 w-10 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p className="mt-2 text-slate-300">Loading data...</p></div> );
const ErrorMessage = ({ message }) => ( <div className="text-center text-yellow-300 glass-card p-4 rounded-lg mt-4 max-w-xl mx-auto"><p>Error: {message}</p></div> );


const weatherIcons = {
    0: <Sun className="text-yellow-300" size="100%" />, // Clear sky
    1: <CloudSun className="text-white" size="100%" />, // Mainly clear
    2: <Cloud className="text-gray-300" size="100%" />, // Partly cloudy
    3: <Cloudy className="text-gray-400" size="100%" />, // Overcast
    45: <CloudFog className="text-gray-400" size="100%" />, // Fog
    48: <CloudFog className="text-gray-400" size="100%" />, // Depositing rime fog
    51: <CloudDrizzle className="text-blue-300" size="100%" />, // Drizzle: Light
    53: <CloudDrizzle className="text-blue-300" size="100%" />, // Drizzle: Moderate
    55: <CloudDrizzle className="text-blue-300" size="100%" />, // Drizzle: Dense
    61: <CloudRain className="text-blue-400" size="100%" />, // Rain: Slight
    63: <CloudRain className="text-blue-400" size="100%" />, // Rain: Moderate
    65: <CloudRain className="text-blue-400" size="100%" />, // Rain: Heavy
    80: <CloudRain className="text-blue-500" size="100%" />, // Rain showers: Slight
    81: <CloudRain className="text-blue-500" size="100%" />, // Rain showers: Moderate
    82: <CloudRain className="text-blue-500" size="100%" />, // Rain showers: Violent
    95: <CloudLightning className="text-yellow-500" size="100%" />, // Thunderstorm: Slight or moderate
    96: <CloudLightning className="text-yellow-500" size="100%" />, // Thunderstorm with slight hail
    99: <Tornado className="text-gray-600" size="100%" />, // Thunderstorm with heavy hail
    71: <Snowflake className="text-white" size="100%" />, // Snow fall: Slight
    73: <Snowflake className="text-white" size="100%" />, // Snow fall: Moderate
    75: <Snowflake className="text-white" size="100%" />, // Snow fall: Heavy
};

const weatherDescriptions = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Depositing rime fog", 51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain", 71: "Slight snow fall", 73: "Moderate snow fall",
    75: "Heavy snow fall", 80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
    95: "Thunderstorm", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail"
};

const getWeatherInfo = (code) => {
    return {
        d: weatherDescriptions[code] || "Cloudy",
        i: weatherIcons[code] || <Cloudy className="text-gray-400" size="100%" />
    };
};

// --- নতুন Helper ফাংশন ---
const getAqiInfo = (aqi) => {
    if (aqi <= 50) return { level: 'Good', color: 'bg-green-500' };
    if (aqi <= 100) return { level: 'Moderate', color: 'bg-yellow-500' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500' };
    if (aqi <= 200) return { level: 'Unhealthy', color: 'bg-red-500' };
    if (aqi <= 300) return { level: 'Very Unhealthy', color: 'bg-purple-500' };
    return { level: 'Hazardous', color: 'bg-red-700' };
};

const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
};


// --- আপডেটেড SunPathComponent ---
const SunPathComponent = ({ sunrise, sunset }) => {
    const [now, setNow] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000); // প্রতি মিনিটে আপডেট
        return () => clearInterval(timer);
    }, []);

    const { sunPosition, daylightPercentage } = React.useMemo(() => {
        const sunriseTime = new Date(sunrise).getTime();
        const sunsetTime = new Date(sunset).getTime();
        const nowTime = now.getTime();

        if (nowTime < sunriseTime) return { sunPosition: 0, daylightPercentage: 0 };
        if (nowTime > sunsetTime) return { sunPosition: 100, daylightPercentage: 100 };

        const totalDaylight = sunsetTime - sunriseTime;
        const elapsed = nowTime - sunriseTime;
        const percentage = (elapsed / totalDaylight) * 100;

        return { sunPosition: percentage, daylightPercentage: percentage };
    }, [sunrise, sunset, now]);

    const angle = (sunPosition / 100) * 180;
    const x = 50 - 45 * Math.cos(angle * (Math.PI / 180));
    const y = 90 - 45 * Math.sin(angle * (Math.PI / 180));

    const isDay = now > new Date(sunrise) && now < new Date(sunset);

    return (
        <div className="relative w-full max-w-lg mx-auto h-48 sm:h-40 mt-4">
            <svg viewBox="0 0 100 100" className="w-full h-auto overflow-visible">
                {/* Path Background */}
                <path d="M 5 90 A 45 45 0 0 1 95 90" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" fill="none" strokeDasharray="4, 4" />
                {/* Filled Path */}
                <path d="M 5 90 A 45 45 0 0 1 95 90" stroke="rgba(251, 191, 36, 1)" strokeWidth="2" fill="none"
                    style={{
                        strokeDasharray: 282.7,
                        strokeDashoffset: 282.7 * (1 - daylightPercentage / 100),
                        transition: 'stroke-dashoffset 1s ease-out'
                    }}
                />
                {/* Sun/Moon Icon */}
                <g transform={`translate(${x}, ${y})`} style={{ transition: 'transform 1s ease-out' }}>
                    {isDay ? <circle cx="0" cy="0" r="5" fill="#FBBF24" /> : <Moon color="#F1F5F9" fill="#F1F5F9" size="10"/> }
                </g>
            </svg>
            <div className="absolute top-full -mt-10 sm:-mt-8 left-0 right-0 flex justify-between items-center px-2">
                <div className="text-center">
                    <Sunrise className="mx-auto" color="#FBBF24" />
                    <p className="text-sm font-semibold">{new Date(sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="text-center">
                    <Sunset className="mx-auto" color="#F97316" />
                    <p className="text-sm font-semibold">{new Date(sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            </div>
        </div>
    );
};

const Home = () => {
    const [city, setCity] = React.useState('');
    const [weatherData, setWeatherData] = React.useState(null);
    const [airQualityData, setAirQualityData] = React.useState(null);
    const [locationInfo, setLocationInfo] = React.useState(null);
    const [selectedDayIndex, setSelectedDayIndex] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
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

    const fetchWeather = React.useCallback(async ({ city = null, coords = null }) => {
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
    }, []);


    React.useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeather({ coords: { latitude, longitude } });
            },
            () => {
                fetchWeather({ city: 'Dhaka' });
            }
        );
    }, [fetchWeather]);

    const handleSearch = () => city.trim() && fetchWeather({ city: city.trim() });
    const handleKeyPress = (e) => e.key === 'Enter' && handleSearch();

    const { displayedWeather, hourlyForecast, aqiInfo } = React.useMemo(() => {
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
        const currentHourIndex = hourly.time.findIndex(timeStr => new Date(timeStr).getHours() >= now.getHours());

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
                        <button onClick={handleSearch} className="px-5 py-3 bg-white/20 text-white rounded-r-full hover:bg-white/30 transition">
                           <Search size={24} />
                        </button>
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
                                        {[
                                            { label: 'UV Index', value: displayedWeather.uv, Icon: UvIcon },
                                            { label: 'Wind Speed', value: `${displayedWeather.wind} km/h`, Icon: WindIcon },
                                            { label: 'Humidity', value: `${displayedWeather.humidity}%`, Icon: HumidityIcon },
                                            { label: 'Feels Like', value: `${displayedWeather.feelsLike}°`, Icon: FeelsLikeIcon },
                                            { label: 'Pressure', value: `${displayedWeather.pressure} hPa`, Icon: PressureIcon },
                                            { label: 'Daylight', value: displayedWeather.daylightDuration, Icon: DaylightIcon },
                                        ].filter(item => item.value && !item.value.includes('null')).map(item => (
                                            <div key={item.label} className="text-center p-3 rounded-lg bg-white/10">
                                                <p className="font-light text-slate-300 text-base flex items-center justify-center gap-2"><item.Icon/> {item.label}</p>
                                                <p className="font-bold text-2xl mt-1">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                           {selectedDayIndex === 0 && (
                                <div className="glass-card p-6 rounded-2xl">
                                    <h3 className="text-2xl font-bold mb-4 text-center sm:text-left">Sunrise & Sunset</h3>
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
