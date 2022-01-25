import { useState, useEffect } from "react";
import { API_KEY } from "./API";
import styles from "./App.module.css";

const App = () => {
  // console.log(API_KEY);

  useEffect(() => {
    // fetch(
    //   `https://api.openweathermap.org/data/2.5/find?q=accra,ghana&units=metric&appid=${API_KEY}`
    // )
    //   .then(response => {
    //     if (!response.ok) {
    //       throw Error("could not fetch data");
    //     } else {
    //       return response.json();
    //     }
    //   })
    //   .then(data => {
    //     // destructure data from api
    //     console.log(data);
    //     const { all: clouds } = data.list[0].clouds;
    //     const { temp, humidity } = data.list[0].main;
    //     const name = data.list[0].name;
    //     const { country } = data.list[0].sys;
    //     const { description: weatherDesc } = data.list[0].weather[0];
    //     console.log({ temp, humidity, name, country, clouds, weatherDesc });
    //   })
    //   .catch(err => console.log(err));
    // fetch("http://ip-api.com/json")
    //   .then(response => response.json())
    //   .then(data => console.group(data));
    Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/find?q=accra,ghana&units=metric&appid=${API_KEY}`
      ),
      fetch("http://ip-api.com/json"),
    ])
      .then(([weather, location]) => {
        console.log(weather, location);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return <div className={styles.wrapper}>hello</div>;
};

export default App;
