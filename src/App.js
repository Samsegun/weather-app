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
    cod: 0,
    message: "loading...",
  });
  const [currentTime, setCurrentTime] = useState(clock());
  const [searchItem, setSearchItem] = useState("lagos");

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${searchItem}&appid=${API_OPENWEATHER}&units=metric`
    )
      .then(response => {
        /** to access the api's custom errors, parse response as json or check for errors in commented code */
        return response.json();
      })
      .then(data => {
        return weatherDetails(data);
      })
      .then(dataObject => setWeatherData(dataObject))
      .catch(err => {
        console.log(err.message);

        setWeatherData(prevWeather => ({
          ...prevWeather,
          message: err.message,
        }));
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
      // api returns random countries when digits are entered. Hence, the approach below was adopted
      setWeatherData({
        cod: "404",
        message: "Please enter String characters!",
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
    /**when data from server contains an error, a message property is attached to the returned data */
    if (+data.cod >= 400) {
      console.log(data);
      return data;
    } else {
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
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>the.weather</h2>
      </header>

      {/* mobile form */}
      <MobileForm submitHandler={submitHandler} />

      {/* main body */}
      <WeatherInfo
        weatherData={weatherData}
        currentTime={currentTime}
        // fetchError={fetchError}
      />

      {/* weather details */}
      <WeatherDetails
        submitHandler={submitHandler}
        clickHandler={clickHandler}
        weatherData={weatherData}
      />

      {/* written on 26th Jan, 2022 */}
      <div className={styles.version}>
        <p> V 1.0.0</p>
      </div>
    </div>
  );
};

/**how handle errors */
// async function sender() {
//   try {
//     const sendee = await fetch("jdjeiwke")

//     if(!sendee.ok) {
//       throw new Error("something went wrong");
//     }

//     const data = await sendee.json()

//     const detsrcture = data.jf.map(item => {
//       // ............
//     })
//   } catch (err) {
//     // .........
//     setError(err.message)
//   }

// }

export default App;
