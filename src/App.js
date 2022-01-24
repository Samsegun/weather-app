import { useState, useEffect } from "react";
import { API_KEY } from "./API";
import styles from "./App.module.css";

const App = () => {
  // console.log(API_KEY);

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/find?q=London,uk&units=metric&appid=${API_KEY}`
    )
      .then(response => {
        if (!response.ok) {
          throw Error("could not fetch data");
        } else {
          return response.json();
        }
      })
      .then(data => {
        // destructure data from api
        // const {name} = data.list;
        console.log(data);
        console.log(data.list);
        console.log(data.list[0].name);
        console.log(data.list[0].main);
      })
      .catch(err => console.log(err));
  }, []);

  return <div className={styles.wrapper}>hello</div>;
};

export default App;
