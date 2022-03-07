import React, { useState, useEffect, useRef } from "react";
import API_OPENWEATHER from "./API";
import styles from "./App.module.css";
import search from "./images/search.png";
// import icons from "../public/icons";
// import moment from "moment";
// import "moment-timezone";

const timeOptions = new Date();

// {
//   weekday: "long",
//   hour: "numeric",
//   minute: "numeric",
//   day: "numeric",
//   month: "short",
//   year: "2-digit",
// }

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [currentTime, setCurrentTime] = useState(timeOptions);
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

    setInterval(() => {
      setCurrentTime(currentTime);
    }, 1000);
  }, [searchItem]);

  // submit handler
  const submitHandler = event => {
    event.preventDefault();

    const userInput = readUserInput.current.value;

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
        setWeatherData(dataObj);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const weatherDetails = data => {
    // destructure json data into different variables like temp, name etc
    const { temp } = data.main,
      { country } = data.sys,
      { name } = data,
      { timezone } = data,
      { icon } = data.weather[0],
      { description } = data.weather[0];

    // const imgUrl = `https://openweathermap.org/img/w/${icon}.png`;

    // return destructured variables as an object
    return { temp, country, name, timezone, icon, description };
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>the.weather</h2>

        {/* <form onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Enter Country..."
            ref={readUserInput}
          />
          <img src={search} alt="search icon" />
        </form>

        <ul className={styles["search-results"]}>
          <li>
            <a href="/">hi</a>
          </li>
          <li>
            <a href="/">hi</a>
          </li>
          <li>
            <a href="/">hi</a>
          </li>
        </ul> */}
      </header>

      {/* main body */}
      <div className={styles["weather-info"]}>
        {!weatherData && <h1>Loading...</h1>}

        {weatherData && (
          <>
            <h1 className={styles.temp}>{Math.floor(weatherData.temp)}&deg;</h1>

            <p className={styles.city}>
              {weatherData.name}
              <sup>{weatherData.country}</sup> <br />
              <span className={styles["city_date-time"]}>
                {currentTime.getHours()}.{currentTime.getMinutes()} -
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {/* <span className={styles["city_name"]}>
                {weatherData.name}
                <sup> {weatherData.country}</sup>
              </span>
              <span className={styles["city_date-time"]}>{currentTime}</span> */}
            </p>

            <p className={styles["weather-icon"]}>
              <img
                src={`${process.env.PUBLIC_URL}/icons/${weatherData.icon}.png`}
                alt="weather icon"
              />{" "}
              <br />
              <span className="weather-desc">{weatherData.description}</span>
            </p>
          </>
        )}
      </div>

      {/* written on 26th Jan, 2022 */}
      <div className={styles.version}>
        <p>&copy; {new Date().getUTCFullYear()} V 0.1.0</p>
      </div>
    </div>
  );
};

export default App;
