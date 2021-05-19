import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { shuffle, chooseRandomActors } from './utils/helperFunctions';

function App() {
  const [data, setData] = useState(null); // objeto com os dados principais do jogo
  const [loading, setLoading] = useState(true); // booleano que define se está esperando uma chamada da API
  const [chosenActors, setChosenActors] = useState([]); // array com todos os atores que foram 
  const [score, setScore] = useState(0); // placar atual do player
  const [highScore, setHighscore] = useState(0); // melhor placar do player

  async function getAPIData() {
    const pg = Math.floor(Math.random() * 499);
    const params = {
      api_key: "dcbc3b3823e75c0234c53f3d37fe29ce",
      language: "en-US",
      page: pg,
    };

    const response = await axios.get(
      "https://api.themoviedb.org/3/person/popular",
      { params }
    );
    return response.data.results;
  }

  async function fetchData() {
    setLoading(true);
    let tries = 0;
    let results = await getAPIData();
    let randomIndex = 0;
    do {
      if (tries === 10) {
        results = await getAPIData();
      }
      randomIndex = Math.floor(Math.random() * 19);
      tries++;
    } while (chosenActors.includes(results[randomIndex].name) || !results[randomIndex].profile_path);

    const randomActor = results[randomIndex];

    setChosenActors([...chosenActors, randomActor.name]);

    let otherPeople = chooseRandomActors(randomActor, randomIndex, results);
    otherPeople = shuffle(otherPeople);

    setData({
      name: randomActor.name,
      avatar: `https://image.tmdb.org/t/p/w600_and_h900_bestv2${randomActor.profile_path}`,
      otherPeople,
    });
    setLoading(false);
  }

  function reset() {
    setChosenActors([]);
    if (score > highScore) {
      setHighscore(score);
      localStorage.setItem("highScore", score);
    }
    setScore(0);
    fetchData();
  }

  async function handleClick(e) {
    if (e.target.value === data.name) {
      setScore(score + 1);
      Toastify({
        text: "Right answer. Good job!!!",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "light-blue",
        stopOnFocus: true,
      }).showToast();
      fetchData();
    } else {
      Toastify({
        text: `Wrong answer! Your score was ${score}.`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
        stopOnFocus: true,
      }).showToast();
      setTimeout(() => reset(), 3000);
    }
  }

  useEffect(() => {
    fetchData();
    const highScore = localStorage.getItem("highScore");
    if (highScore) {
      setHighscore(highScore);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="App">
      <h1>Random Actor Quiz</h1>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <img src={data.avatar} alt={data.name} />
          <div className="options">
            {data.otherPeople.map((person, i) => (
              <div className="option" key={i}>
                <button onClick={handleClick} value={person}>
                  {person}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="scores">
        <h2>Score: {score}</h2>
        <h2>Highscore: {highScore}</h2>
      </div>
    </div>
  );
}

export default App;
