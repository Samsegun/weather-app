import styles from "../../App.module.css";

const WeatherInfo = ({ weatherData, currentTime, fetchError }) => {
  return (
    <div className={styles["weather-info"]}>
      {+weatherData.cod > 200 && (
        <h1 className={styles["error-message"]}>{weatherData.message}</h1>
      )}

      {/* not working yet */}
      {fetchError && (
        <h1 className={styles["fetch-error"]}>{fetchError.status}</h1>
      )}

      {+weatherData.cod <= 200 && (
        <>
          <h1 className={styles.temp}>{Math.floor(weatherData.temp)}&deg;C</h1>

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
  );
};

export default WeatherInfo;
