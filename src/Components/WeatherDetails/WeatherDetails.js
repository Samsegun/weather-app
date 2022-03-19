import { useRef } from "react";
import styles from "../../App.module.css";
import search from "../../images/magnifying-glass.png";

const WeatherDetails = ({ submitHandler, weatherData, clickHandler }) => {
  const readUserInput = useRef("");

  return (
    <div className={styles.details}>
      <form
        className={styles["desktop-form"]}
        onSubmit={e => submitHandler(e, readUserInput)}
      >
        <input
          type="text"
          placeholder="Another Location..."
          ref={readUserInput}
          className={+weatherData.cod >= 400 ? styles["search-error"] : ""}
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

      {+weatherData.cod === 0 && <></>}

      {+weatherData.cod === 200 && (
        <div className={styles["weather-details"]}>
          <h2 className={styles["weather-details__title"]}>Weather Details</h2>

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
  );
};

export default WeatherDetails;
