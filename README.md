<div align="center">
  <h1 style="margin-top: 10px;">SkyCast | Advanced Weather App</h1>
</div>

![Project Screenshot](./public/screenshot.avif)

<div align="center">

  [![React](https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Open-Meteo](https://img.shields.io/badge/Open--Meteo-orange?style=for-the-badge&logo=sun&logoColor=white)](https://open-meteo.com/)
  [![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://nahid-weather-app.vercel.app/)

  <h3>🚀 <a href="https://your-live-link.vercel.app/">View Live Website</a></h3>
</div>

---

## 📖 About The Project

Welcome to **SkyCast**, a highly responsive and feature-rich **Weather Forecasting Application** developed by **Nahid**. This application provides real-time weather updates, air quality data, and detailed forecasts for any city in the world.

The app utilizes the **Open-Meteo API** for accurate data fetching and features a **Glassmorphism UI** with dynamic background handling based on user interaction. It also includes smart logic to automatically detect the user's location based on their Timezone.

---

## 🛠️ Tech Stack

- **Frontend Framework:** [React.js](https://reactjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Custom CSS Injection
- **Data Provider:** [Open-Meteo API](https://open-meteo.com/) (Geocoding, Weather, Air Quality)
- **Icons:** `react-icons` & Custom SVG Components
- **Deployment:** Vercel

---

## ✨ Key Features

- **📍 Smart Location Detection:** Automatically detects the user's city based on their browser's Timezone on first load.
- **🎨 Dynamic Backgrounds:** Randomly cycles through high-quality background images on every reload for a fresh look.
- **🔍 Global Search:** Search for any city worldwide using the integrated Geocoding API.
- **🌦️ Detailed Forecasts:** 
  - **Current Weather:** Temperature, Feels Like, Humidity, Wind Speed & Direction.
  - **Hourly Forecast:** Next 24-hour breakdown.
  - **Daily Forecast:** Multi-day prediction with selectable details.
- **🍃 Air Quality Index (AQI):** Real-time monitoring of US AQI, PM2.5, and Ozone levels.
- **☀️ Sun Path Tracker:** Visualize Sunrise, Sunset, and Daylight duration.
- **🌗 Modern UI/UX:** Features a beautiful Glassmorphism design (`glass-card`), smooth fade-in animations, and a custom scrollbar.

---

## 📂 Project Structure (Key Component)

The core logic resides in `Home.jsx`, which handles:
1. **State Management:** Uses `useState` and `useEffect` to handle weather data and loading states.
2. **Data Fetching:** Native `fetch` API implementation with error handling for network requests.
3. **Memoization:** Uses `useMemo` to optimize heavy calculations for displayed weather and hourly forecasts.

---

## 💻 Getting Started

Follow the instructions below to run this project locally on your machine.

### Prerequisites
Make sure you have **Node.js** installed.

### Installation Steps

**1. Clone the repository**
```bash
git clone https://github.com/NahidAhmed-12/portfolio.git
```

**2. Navigate to project directory**
```bash
cd your-repo-name
```

**3. Install Dependencies**
```bash
npm install
# or if you use yarn
yarn install
```

**4. Start the Development Server**
```bash
npm start
# or
yarn start
```

The application will open automatically at `http://localhost:3000`.

---

## 📂 Folder Structure

```
src/
├── assets/             # Images (screenshot.avif, Nahid.avif)
├── pages/              # All Components & Pages
│   ├── Hero.jsx        # Main Hero section with 3D animation
│   ├── Navbar.jsx      # Responsive Navigation
│   ├── Footer.jsx      # Footer section
│   └── ...             # Other page components
├── App.js              # Main Component & Routes
└── index.css           # Global Styles & Tailwind Directives
```

---



## 📬 Contact Me

Feel free to reach out for collaborations or just a friendly hello!

- **Email:** [your-email@gmail.com](mailto:your-email@gmail.com)
- **LinkedIn:** [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)
- **GitHub:** [github.com/yourusername](https://github.com/yourusername)

---

<div align="center">
  <p>Made with ❤️ by <b>Nahid</b></p>
  <p>⭐️ If you find this weather app useful, please give it a star!</p>
</div>
