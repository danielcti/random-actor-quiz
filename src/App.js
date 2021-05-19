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
  const [page, setPage] = useState(1); // parametro page que seria enviado para a API

  async function fetchData(pg) {
    setLoading(true);
    const params = {
      api_key: "dcbc3b3823e75c0234c53f3d37fe29ce",
      language: "en-US",
      page: pg ? pg : page,
    };

    let tries = 0;

    const response = await axios.get(
      "https://api.themoviedb.org/3/person/popular",
      { params }
    );
    const results = response.data.results;
    let randomIndex = 0;

    do {
      if (tries === 19) {
        const pg = page;
        setPage(page + 1);
        return fetchData(pg);
      }
      randomIndex = Math.floor(Math.random() * 19);
      tries++;
    } while (chosenActors.includes(results[randomIndex].name));

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
    setPage(1);
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
