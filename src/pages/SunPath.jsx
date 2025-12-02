import React, { useState, useEffect, useMemo } from 'react';
import { SunIcon, MoonIcon } from '../utils/IconsAndHelpers';

const SunPath = ({ sunrise, sunset }) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000); 
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
            const midnight = new Date(now).setHours(0, 0, 0, 0);
            const totalNight = (sunriseTime - midnight) + (new Date(sunset).setHours(24,0,0,0) - sunsetTime);
            let elapsedNight;

            if (nowTime < sunriseTime) { 
                elapsedNight = nowTime - (new Date(sunset).getTime() - 24 * 60 * 60 * 1000);
            } else { 
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
                <path d="M 5 90 A 45 45 0 0 1 95 90" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" fill="none" strokeDasharray="4, 4" />
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

export default SunPath;