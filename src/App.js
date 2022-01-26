import { useState, useEffect } from "react";
import { API_KEY } from "./API";
import styles from "./App.module.css";

const App = () => {
  useEffect(() => {
    Promise.all([
      // fetch(
      //   `https://api.openweathermap.org/data/2.5/onecall?lat=${5.556}&lon=${-0.1969}&exclude={part}&appid=${API_KEY}`
      // ).then(response => response.json()),
      fetch(
        `https://api.openweathermap.org/data/2.5/find?q=lagos,nigeria&units=metric&appid=${API_KEY}`
      ).then(response => response.json()),
      fetch("http://ip-api.com/json").then(response => response.json()),
    ])
      .then(value => {
        console.log(value);
        // destructure weather&location data from value and return both as an object
        const [weather, location] = value;

        return { weather, location };
      })
      .then(data => {
        // destructure weather&location data from data object
        const { location, weather } = data;

        // extract user location
        const timeZone = location.timezone;

        // extract weather info
        const cityName = weather.list[0].name;
        const temp = Math.round(weather.list[0].main.temp);
        const humidity = weather.list[0].main.humidity;
        const cloudsPercent = weather.list[0].clouds.all;
        const cloudsDesc = weather.list[0].weather[0].description;
        const image = weather.list[0].weather[0].icon;
        const imageUrl = `http://openweathermap.org/img/wn/${image}@2x.png`;

        // display on the console
        console.log(
          timeZone,
          cityName,
          temp,
          humidity,
          cloudsPercent,
          cloudsDesc,
          imageUrl
        );
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      <header className={styles.header}>
        <h2>the.weather</h2>
      </header>
      <div className={styles["weather-info"]}>
        <p>temp &deg;</p>
        <p>
          cityname <span>time and date</span>
        </p>
        <p>
          <img src="" alt="weather icon" />
          <span>weather description</span>
        </p>
      </div>
    </>
  );
};

export default App;
