import React from 'react';
import { UvIcon, WindIcon, HumidityIcon, FeelsLikeIcon, PressureIcon, DaylightIcon, AirQualityIcon, getWeatherInfo } from '../utils/IconsAndHelpers';
import SunPath from './SunPath';

export const SearchSection = ({ city, setCity, handleKeyPress, handleSearch }) => (
    <div className="flex w-full max-w-lg mx-auto mb-8 glass-card rounded-full">
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} onKeyPress={handleKeyPress} placeholder="Search for a city..." className="w-full py-3 px-6 text-white bg-transparent rounded-l-full focus:outline-none placeholder-slate-300"/>
        <button onClick={handleSearch} className="px-5 py-3 bg-white/20 text-white rounded-r-full hover:bg-white/30 transition"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
    </div>
);

export const CurrentWeatherSection = ({ locationInfo, displayedWeather, weatherInfo, selectedDayIndex }) => (
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
);

export const HourlyForecastSection = ({ hourlyForecast }) => (
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
);

export const DailyForecastSection = ({ weatherData, selectedDayIndex, setSelectedDayIndex }) => (
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
);

export const SunPathSection = ({ sunrise, sunset }) => (
    <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-2xl font-bold mb-4">Sunrise & Sunset</h3>
        <SunPath sunrise={sunrise} sunset={sunset} />
    </div>
);

export const AirQualitySection = ({ aqiInfo }) => (
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
);