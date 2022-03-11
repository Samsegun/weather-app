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
  const [weatherData, setWeatherData] = useState({
    cod: "404",
    message: "loading...",
  });
  const [currentTime, setCurrentTime] = useState(clock());
  const [searchItem, setSearchItem] = useState("lagos");
  const readUserInputMobile = useRef("");
  const readUserInput = useRef("");

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${searchItem}&appid=${API_OPENWEATHER}&units=metric`
    )
      .then(response => response.json())
      .then(data => {
        console.log(data);

        if (data.cod > 200) {
          return data;
        } else {
          return weatherDetails(data);
        }
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
  const submitHandler = (e, text) => {
    e.preventDefault();

    let userInput = text.current.value;

    const newUserinput = userInput.trim().toLowerCase();

    if (parseInt(newUserinput)) {
      setWeatherData({
        cod: "404",
        message: "Please enter valid values!",
      });
      text.current.value = userInput;
    } else {
      setSearchItem(newUserinput);
      text.current.value = "";
    }
  };

  const clickHandler = event => {
    if (event.target.textContent) {
      setSearchItem(event.target.textContent);
    }
  };

  const weatherDetails = data => {
    // destructure json data into different variables like temp, name etc
    const { temp, humidity, feels_like: feelsLike } = data.main,
      { country } = data.sys,
      { name, cod } = data,
      { timezone } = data,
      // { icon } = data.weather[0],
      { description, icon, main } = data.weather[0],
      { sunrise } = data.sys,
      { sunset } = data.sys,
      { speed } = data.wind;

    // convert sunrise and sunset time with moment
    let sunriseTime = moment.unix(sunrise).format("HH:MM");
    let sunsetTime = moment.unix(sunset).format("HH:MM");

    // convert windspeed from m/s to kmph
    let windSpeed = 3.6 * speed;

    // const imgUrl = `https://openweathermap.org/img/w/${icon}.png`;

    // return destructured variables as an object
    return {
      temp,
      feelsLike,
      humidity,
      country,
      name,
      cod,
      timezone,
      icon,
      description,
      main,
      sunriseTime,
      sunsetTime,
      windSpeed,
    };
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>the.weather</h2>
      </header>

      <form
        className={styles["mobile-form"]}
        onSubmit={e => submitHandler(e, readUserInputMobile)}
      >
        <input
          type="text"
          placeholder="Another Location..."
          ref={readUserInputMobile}
          className={styles["mobile-form_input"]}
        />
        <img
          className={styles["search-icon"]}
          src={search}
          alt="search icon"
          onClick={e => submitHandler(e, readUserInputMobile)}
        />
      </form>

      {/* main body */}
      <div className={styles["weather-info"]}>
        {+weatherData.cod > 200 && (
          <h1 className={styles["error-message"]}>{weatherData.message}</h1>
        )}

        {+weatherData.cod <= 200 && (
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

      {/* weather details */}
      <div className={styles.details}>
        <form
          className={styles["desktop-form"]}
          onSubmit={e => submitHandler(e, readUserInput)}
        >
          <input
            type="text"
            placeholder="Another Location..."
            ref={readUserInput}
            className={+weatherData.cod > 200 ? styles["search-error"] : ""}
          />
          <img
            className={styles["search-icon"]}
            src={search}
            alt="search icon"
            onClick={e => submitHandler(e, readUserInput)}
          />
        </form>

        <ul className={styles["search-results"]} onClick={clickHandler}>
          <li>Lagos</li>
          <li>New York</li>
          <li>London</li>
          <li>Moscow</li>
        </ul>

        {+weatherData.cod <= 200 && (
          <div className={styles["weather-details"]}>
            <h2 className={styles["weather-details__title"]}>
              Weather Details
            </h2>

            <ul>
              <li>
                <span className={styles.desc}>Feels like</span>
                <span className={styles.data}>
                  {Math.floor(weatherData.feelsLike)}&deg;C
                </span>
              </li>
              <li>
                <span className={styles.desc}>Humidity</span>{" "}
                <span className={styles.data}>{weatherData.humidity}%</span>
              </li>
              <li>
                <span className={styles.desc}>Wind Speed</span>{" "}
                <span className={styles.data}>
                  {Math.floor(weatherData.windSpeed)} KMPH
                </span>
              </li>
              <li>
                <span className={styles.desc}>Description</span>{" "}
                <span className={styles.data}>{weatherData.description}</span>
              </li>
              <li>
                <span className={styles.desc}>Country</span>{" "}
                <span className={styles.data}>{weatherData.country}</span>
              </li>
              <li>
                <span className={styles.desc}>Sunrise</span>{" "}
                <span className={styles.data}>{weatherData.sunriseTime}</span>
              </li>
              <li>
                <span className={styles.desc}>Sunset</span>{" "}
                <span className={styles.data}>{weatherData.sunsetTime}</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* written on 26th Jan, 2022 */}
      <div className={styles.version}>
        <p>{new Date().getUTCFullYear()} V 0.1.0</p>
      </div>
    </div>
  );
};

export default App;
