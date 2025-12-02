import React, { useState, useEffect, useMemo } from 'react';
import { Loader, ErrorMessage, getWeatherInfo, getAqiInfo, getWindDirection } from '../utils/IconsAndHelpers';
import { 
    SearchSection, 
    CurrentWeatherSection, 
    HourlyForecastSection, 
    DailyForecastSection, 
    SunPathSection, 
    AirQualitySection 
} from '../pages/WeatherSections';

const Home = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [airQualityData, setAirQualityData] = useState(null);
    const [locationInfo, setLocationInfo] = useState(null);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Background & Styles ---
    useEffect(() => {
        const backgroundImages = [
            '/Weather-img/img-1.avif',
            '/Weather-img/img-2.avif',
            '/Weather-img/img-3.avif',
            '/Weather-img/img-4.avif'
        ];

        const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

        const css = `
            body {
                color: #ffffff;
                font-family: 'Inter', sans-serif;
            }
            .main-bg::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background-image: url('${randomImage}');
                background-size: cover;
                background-position: center;
                z-index: -1;
                filter: brightness(0.6);
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
                background: rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .custom-scrollbar::-webkit-scrollbar {
                height: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 10px;
            }
        `;
        const styleElement = document.createElement('style');
        styleElement.innerHTML = css;
        document.head.appendChild(styleElement);

        return () => {
            if(document.head.contains(styleElement)){
                document.head.removeChild(styleElement);
            }
        };
    }, []);

    const fetchAPI = async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Could not fetch data. Please check your connection or the city name.`);
        return response.json();
    };

    const fetchWeather = async ({ city = null }) => {
        setLoading(true); setError(null); setWeatherData(null); setAirQualityData(null);
        try {
            // শুধুমাত্র সিটির নাম দিয়ে ল্যাটিচিউড/লঙ্গিচিউড এবং দেশের নাম বের করা
            const geoData = await fetchAPI(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
            
            if (!geoData.results?.length) throw new Error('City not found.');
            
            const { latitude, longitude, name, country } = geoData.results[0];
            const shortCountryName = country ? country.split(',')[0] : '';
            
            setLocationInfo({ city: name, country: shortCountryName });

            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure,wind_direction_10m&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_mean,daylight_duration&timezone=auto`;
            const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm2_5,ozone`;

            const [weather, airQuality] = await Promise.all([ fetchAPI(weatherUrl), fetchAPI(airQualityUrl) ]);

            setWeatherData(weather);
            setAirQualityData(airQuality);
            setSelectedDayIndex(0);

        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    // --- INITIAL LOAD (SYSTEM DETECTED LOCATION) ---
    useEffect(() => {
        try {
            // 1. ব্রাউজারের টাইমজোন ডিটেক্ট করা (যেমন: "Asia/Dhaka" বা "America/New_York")
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            
            if (userTimezone && userTimezone.includes('/')) {
                // 2. টাইমজোন স্ট্রিং থেকে শহরের নাম বের করা (যেমন: "Dhaka" বা "New York")
                const detectedCity = userTimezone.split('/')[1].replace(/_/g, ' ');
                console.log("Detected User Location via Timezone:", detectedCity);
                
                // 3. সেই শহরের ওয়েদার কল করা
                fetchWeather({ city: detectedCity });
            } else {
                // যদি কোনো কারণে টাইমজোন না পাওয়া যায়, তবে ডিফল্ট ঢাকা
                fetchWeather({ city: 'Dhaka' });
            }
        } catch (error) {
            console.error("Timezone detection failed:", error);
            fetchWeather({ city: 'Dhaka' });
        }
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
        const safeIndex = currentHourIndex === -1 ? 0 : currentHourIndex;
        
        const hForecast = hourly.time.slice(safeIndex, safeIndex + 24).map((time, i) => ({
            time: new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
            temp: Math.round(hourly.temperature_2m[safeIndex + i]),
            weatherCode: hourly.weather_code[safeIndex + i],
            precipitation: hourly.precipitation_probability[safeIndex + i]
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
                    
                    <SearchSection 
                        city={city} 
                        setCity={setCity} 
                        handleKeyPress={handleKeyPress} 
                        handleSearch={handleSearch} 
                    />

                    {loading && <Loader />}
                    {error && <ErrorMessage message={error} />}

                    {weatherData && displayedWeather && locationInfo && weatherInfo && (
                        <div className="animate-fade-in space-y-8">
                            
                            <CurrentWeatherSection 
                                locationInfo={locationInfo}
                                displayedWeather={displayedWeather}
                                weatherInfo={weatherInfo}
                                selectedDayIndex={selectedDayIndex}
                            />

                            {selectedDayIndex === 0 && (
                                <HourlyForecastSection hourlyForecast={hourlyForecast} />
                            )}

                            <DailyForecastSection 
                                weatherData={weatherData}
                                selectedDayIndex={selectedDayIndex}
                                setSelectedDayIndex={setSelectedDayIndex}
                            />

                            {selectedDayIndex === 0 && (
                                <SunPathSection 
                                    sunrise={displayedWeather.sunrise} 
                                    sunset={displayedWeather.sunset} 
                                />
                            )}

                            {aqiInfo && selectedDayIndex === 0 && (
                                <AirQualitySection aqiInfo={aqiInfo} />
                            )}

                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;