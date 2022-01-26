import { useState, useEffect } from "react";
import { API_KEY } from "./API";
import styles from "./App.module.css";

const App = () => {
  const [success, setSuccess] = useState(true);
  const [temp, setTemp] = useState();
  const [cityName, setCityName] = useState();
  const [cloudsDesc, setCloudsDesc] = useState();
  const [imageSrc, setImageSrc] = useState();
  const [country, setCountry] = useState();

  useEffect(() => {
    Promise.all([
      // fetch(
      //   `https://api.openweathermap.org/data/2.5/onecall?lat=${5.556}&lon=${-0.1969}&exclude={part}&appid=${API_KEY}`
      // ).then(response => response.json()),
      fetch(
        `https://api.openweathermap.org/data/2.5/find?q=dubai&units=metric&appid=${API_KEY}`
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
        const country = weather.list[0].sys.country;

        // display on the console
        console.log(
          timeZone,
          cityName,
          temp,
          humidity,
          cloudsPercent,
          cloudsDesc,
          imageUrl,
          country
        );

        setCityName(cityName);
        setTemp(temp);
        setCloudsDesc(cloudsDesc);
        setImageSrc(imageUrl);
        setCountry(country);
      })
      .catch(err => {
        console.log(err);
        setSuccess(false);
      });
  }, [cityName]);

  const changeHandler = event => {
    console.log(event);
  };

  const submitHandler = () => {
    console.log("hi");
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
          {/* <img src="./images/search.png" alt="search icon" /> */}
        </form>
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
              <span className={styles["city_date-time"]}>
                06:09-Monday, 9 Sep '19
              </span>
            </p>
            <p className={styles["weather-icon"]}>
              <img src={imageSrc} alt="weather icon" />
              <span className="weather-desc">{cloudsDesc}</span>
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default App;
