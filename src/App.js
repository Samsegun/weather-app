import React, { useState, useEffect } from "react";
import API_OPENWEATHER from "./API";
import styles from "./App.module.css";
import MobileForm from "./Components/MobileForm/MobileForm";
import moment from "moment";
import WeatherInfo from "./Components/WeatherInfo/WeatherInfo";
import WeatherDetails from "./Components/WeatherDetails/WeatherDetails";
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

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${searchItem}&appid=${API_OPENWEATHER}&units=metric`
    )
      .then(response => response.json())
      .then(data => {
        if (data.cod > 200) {
          return data;
        } else {
          return weatherDetails(data);
        }
      })
      .then(dataObj => {
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
      { description, icon, main } = data.weather[0],
      { sunrise } = data.sys,
      { sunset } = data.sys,
      { speed } = data.wind;

    // convert sunrise and sunset time with moment
    let sunriseTime = moment.unix(sunrise).format("HH:MM");
    let sunsetTime = moment.unix(sunset).format("HH:MM");

    // convert windspeed from m/s to kmph
    let windSpeed = 3.6 * speed;

    // return destructured variables as an object
    return {
      temp,
      feelsLike,
      humidity,
      country,
      name,
      cod,
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

      {/* mobile form */}
      <MobileForm submitHandler={submitHandler} />

      {/* main body */}
      <WeatherInfo weatherData={weatherData} currentTime={currentTime} />

      {/* weather details */}
      <WeatherDetails
        submitHandler={submitHandler}
        clickHandler={clickHandler}
        weatherData={weatherData}
      />

      {/* written on 26th Jan, 2022 */}
      <div className={styles.version}>
        <p>{new Date().getUTCFullYear()} V 0.1.0</p>
      </div>
    </div>
  );
};

export default App;
