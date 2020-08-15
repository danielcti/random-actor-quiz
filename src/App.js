import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [data, setData] = useState(null);
  const [score, setScore] = useState(0);

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  async function fetchData() {
    const params = {
      api_key: "dcbc3b3823e75c0234c53f3d37fe29ce",
      language: "en-US",
      page: "1",
    };

    const response = await axios.get(
      "https://api.themoviedb.org/3/person/popular",
      { params }
    );
    const results = response.data.results;
    const randomIndex = Math.floor(Math.random() * 19);
    let otherPeople = [];
    const randomActor = results[randomIndex];
    for (let i = 0; i < 4; i++) {
      let randNumber = 0;
      do {
        randNumber = Math.floor(Math.random() * 19);
      } while (
        randNumber === randomIndex &&
        !otherPeople.includes(results[randNumber])
      );
      otherPeople.push(results[randNumber].name);
    }

    otherPeople.push(randomActor.name);
    otherPeople = shuffle(otherPeople);

    setData({
      name: randomActor.name,
      avatar: `https://image.tmdb.org/t/p/w600_and_h900_bestv2${randomActor.profile_path}`,
      otherPeople,
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleClick(e) {
    console.log(e.target.value);
    if (e.target.value === data.name) {
      setScore(score + 1);
    }

    fetchData();
  }

  if (!data) {
    return <h1>loading...</h1>;
  }

  return (
    <div className="App">
      <img src={data.avatar} />
      <div className="options">
        {data.otherPeople.map((person, i) => (
          <div className="option" key={i}>
            <button onClick={handleClick} value={person}>
              {person}
            </button>
          </div>
        ))}
      </div>
      <h2>Score:{score}</h2>
    </div>
  );
}

export default App;
