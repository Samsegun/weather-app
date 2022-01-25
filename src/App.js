import { useState, useEffect } from "react";
import { API_KEY } from "./API";
import styles from "./App.module.css";

const App = () => {
  useEffect(() => {
    Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/find?q=accra,ghana&units=metric&appid=${API_KEY}`
      ).then(response => response.json()),
      fetch("http://ip-api.com/json").then(response => response.json()),
    ])
      .then(value => {
        const [weather, location] = value;

        return { weather, location };
      })
      .then(data => {
        const { location, weather } = data;
        console.log(location, weather);
      })
      .catch(err => console.log(err));
  }, []);

  return <div className={styles.wrapper}>hello</div>;
};

export default App;
