import React, { useState, useEffect, useRef } from "react";
import API_OPENWEATHER from "./API";
import styles from "./App.module.css";
import search from "./images/magnifying-glass.png";
// import icons from "../public/icons";
import moment from "moment";
// import "moment-timezone";

const clock = () => {
  const hours = (new Date().getHours() < 10 ? "0" : "") + new Date().getHours();

  const minutes =
    (new Date().getMinutes() < 10 ? "0" : "") + new Date().getMinutes();

  // const seconds = `${
  //   new Date().getSeconds() < 10 ? "0" : ""
  // }${new Date().getSeconds()}`;

  const weekday = new Date().toLocaleString("en-US", { weekday: "long" });

  const day = new Date().toLocaleString("en-US", { day: "numeric" });

  const month = new Date().toLocaleString("en-US", { month: "short" });

  const year = new Date().toLocaleString("en-US", { year: "2-digit" });

  return `${hours}:${minutes} - ${weekday}, ${day} ${month} '${year}`;
};

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [currentTime, setCurrentTime] = useState(clock());
  const [searchItem, setSearchItem] = useState("lagos");
  const readUserInput = useRef("");

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${searchItem}&appid=${API_OPENWEATHER}&units=metric`
    )
      .then(response => response.json())
      .then(data => {
        console.log(data);

        return weatherDetails(data);
      })
      .then(dataObj => {
        console.log(dataObj);

        //set returned object as weatherdata state
        setWeatherData(dataObj);
      })
      .catch(err => {
        console.log(err);
      });

    let time = setInterval(() => {
      setCurrentTime(clock());
    }, 1000);

    return () => clearInterval(time);
  }, [searchItem]);

  // submit handler
  const submitHandler = event => {
    event.preventDefault();

    let userInput = readUserInput.current.value;

    const newUserinput = userInput.trim().toLowerCase();

    console.log(newUserinput);

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${newUserinput}&appid=${API_OPENWEATHER}&units=metric`,
      { mode: "cors" }
    )
      .then(response => response.json())
      .then(data => {
        console.log(data);

        return weatherDetails(data);
      })
      .then(dataObj => {
        readUserInput.current.value = "";
        setWeatherData(dataObj);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const weatherDetails = data => {
    // destructure json data into different variables like temp, name etc
    const { temp, humidity, feels_like: feelsLike } = data.main,
      { country } = data.sys,
      { name } = data,
      { timezone } = data,
      // { icon } = data.weather[0],
      { description, icon, main } = data.weather[0],
      { sunrise } = data.sys,
      { sunset } = data.sys,
      { speed } = data.wind;

    let sunriseTime = moment.unix(sunrise).format("HH:MM");
    let sunsetTime = moment.unix(sunset).format("HH:MM");

    // const imgUrl = `https://openweathermap.org/img/w/${icon}.png`;

    // return destructured variables as an object
    return {
      temp,
      feelsLike,
      humidity,
      country,
      name,
      timezone,
      icon,
      description,
      main,
      sunriseTime,
      sunsetTime,
      speed,
    };
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>the.weather</h2>
      </header>

      {/* main body */}
      <div className={styles["weather-info"]}>
        {!weatherData && <h1>Loading...</h1>}

        {weatherData && (
          <>
            <h1 className={styles.temp}>{Math.floor(weatherData.temp)}&deg;</h1>

            <p className={styles.city}>
              <span className={styles["city_name"]}>{weatherData.name}</span>
              <br />
              <span className={styles["city_date-time"]}>{currentTime}</span>
            </p>

            <p className={styles["weather-icon"]}>
              <img
                src={`${process.env.PUBLIC_URL}/icons/${weatherData.icon}.png`}
                alt="weather icon"
              />{" "}
              <br />
              <span className="weather-desc">{weatherData.main}</span>
            </p>
          </>
        )}
      </div>

      {weatherData && (
        <div className={styles.details}>
          <form onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Another Location..."
              ref={readUserInput}
            />
            <img
              className={styles["search-icon"]}
              src={search}
              alt="search icon"
              onClick={submitHandler}
            />
          </form>

          <ul className={styles["search-results"]}>
            <li>
              <a href="/">Lagos</a>
            </li>
            <li>
              <a href="/">New York</a>
            </li>
            <li>
              <a href="/">London</a>
            </li>
            <li>
              <a href="/">Moscow</a>
            </li>
          </ul>

          {/* weather details */}
          <div className={styles["weather-details"]}>
            <h2 className={styles["weather-details__title"]}>
              Weather Details
            </h2>

            <ul>
              <li>
                <span>Feels like</span>
                <span>{Math.floor(weatherData.feelsLike)}&deg;C</span>
              </li>
              <li>
                <span>Humidity</span> <span>{weatherData.humidity}%</span>
              </li>
              <li>
                <span>Wind Speed</span>{" "}
                <span>{Math.floor(weatherData.speed)}km/hr</span>
              </li>
              <li>
                <span>Desscription</span> <span>{weatherData.description}</span>
              </li>
              <li>
                <span>Country</span> <span>{weatherData.country}</span>
              </li>
              <li>
                <span>Sunrise</span> <span>{weatherData.sunriseTime}</span>
              </li>
              <li>
                <span>Sunset</span> <span>{weatherData.sunsetTime}</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* written on 26th Jan, 2022 */}
      <div className={styles.version}>
        <p>{new Date().getUTCFullYear()} V 0.1.0</p>
      </div>
    </div>
  );
};

export default App;
