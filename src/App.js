import { useState, useEffect } from "react";
import { API_OPENWEATHER, API_WEATHERBIT } from "./API";
import styles from "./App.module.css";
import search from "./images/search.png";

const App = () => {
  const [success, setSuccess] = useState(true);
  const [temp, setTemp] = useState();
  const [cityName, setCityName] = useState("");
  const [cloudsDesc, setCloudsDesc] = useState();
  const [imageSrc, setImageSrc] = useState();
  const [country, setCountry] = useState();
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleString("en-us", {
      timeZone: "Africa/Lagos",
      timeStyle: "medium",
      hourCycle: "h24",
    })
  );
  const [timeIsPresent, setTimeIsPresent] = useState(false);
  const [searchItem, setSearchItem] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(
        `https://api.weatherbit.io/v2.0/current?city=${cityName}=c&key=${API_WEATHERBIT}`
      ).then(response => response.json()),
      fetch("http://ip-api.com/json").then(response => response.json()),
    ])
      .then(value => {
        // destructure weather&location data from value and return both as an object
        const [weather, location] = value;

        return { weather, location };
      })
      .then(data => {
        // destructure weather&location data from data object
        const { location, weather } = data;

        // extract user location
        const userTimeZone = location.timezone;

        console.log(weather);

        // extract weather info
        const cityName = weather.data[0].city_name;
        const temp = Math.round(weather.data[0].temp);
        const humidity = Math.round(weather.data[0].rh);
        const cloudsPercent = weather.data[0].clouds;
        const cloudsDesc = weather.data[0].weather.description;
        const image = weather.data[0].weather.icon;
        const imageUrl = `https://www.weatherbit.io/static/img/icons/${image}.png`;
        const country = weather.data[0].country_code;
        const timeZone = weather.data[0].timezone;

        // display on the console
        console.log(
          cityName,
          temp,
          humidity,
          cloudsPercent,
          cloudsDesc,
          image,
          country,
          timeZone
        );

        setCityName(cityName);
        setTemp(temp);
        setCloudsDesc(cloudsDesc);
        setImageSrc(imageUrl);
        setCountry(country);
        setCurrentTime(
          new Date().toLocaleString("en-us", {
            timeZone: timeZone,
            timeStyle: "medium",
            hourCycle: "h24",
          })
        );
        setTimeIsPresent(true);
      })
      .catch(err => {
        console.log(err);
        setSuccess(false);
      });
  }, [cityName]);

  const changeHandler = event => {
    const userInput = event.target.value.toLowerCase();

    console.log(userInput);

    setSearchItem(userInput);
  };

  const submitHandler = event => {
    event.preventDefault();

    fetch(
      `https://api.weatherbit.io/v2.0/current?city=${searchItem}&key=${API_WEATHERBIT}`
    )
      .then(response => response.json())
      .then(data => {
        const enteredCity = data.data[0].city_name;
        setCityName(enteredCity);
      });
  };

  return (
    <>
      <header className={styles.header}>
        <h2>the.weather</h2>

        <form onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Enter Country..."
            onChange={changeHandler}
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
        </ul>
      </header>
      <div className={styles["weather-info"]}>
        {!success && <h1>Can't load data</h1>}

        {success && (
          <>
            <h1 className={styles.temp}>{temp}&deg;C</h1>
            <p className={styles.city}>
              <span className={styles["city_name"]}>
                {cityName}
                <sup> {country}</sup>
              </span>
              <span className={styles["city_date-time"]}>{currentTime}</span>
            </p>
            <p className={styles["weather-icon"]}>
              <img src={imageSrc} alt="weather icon" />
              <span className="weather-desc">{cloudsDesc}</span>
            </p>
          </>
        )}
      </div>

      {/* written on 26th Jan, 2022 */}
      <div className={styles.version}>
        <p>&copy; {new Date().getUTCFullYear()} V 0.1.0</p>
      </div>
    </>
  );
};

export default App;
