import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import actorsGenderList from "./actorsGenderList.json";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chosenActors, setChosenActors] = useState([]);
  const [score, setScore] = useState(0);
  const [page, setPage] = useState(1);

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

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
    const randomActorGender = actorsGenderList[results[randomIndex].name];
    console.log(randomActorGender);

    setChosenActors([...chosenActors, randomActor.name]);

    let otherPeople = [];
    for (let i = 0; i < 4; i++) {
      let randNumber = 0;
      let gender = "";
      do {
        randNumber = Math.floor(Math.random() * 19);
        gender = actorsGenderList[results[randNumber].name];
        console.log(results[randNumber].name, gender);
      } while (
        gender !== randomActorGender ||
        randNumber === randomIndex ||
        otherPeople.includes(results[randNumber].name)
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
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleClick(e) {
    if (e.target.value === data.name) {
      setScore(score + 1);
      Toastify({
        text: "Right answer. Good job!!!",
        duration: 2000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        backgroundColor: "light-blue",
        stopOnFocus: true, // Prevents dismissing of toast on hover
      }).showToast();
    } else {
      Toastify({
        text: "Wrong answer!!!",
        duration: 2000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        backgroundColor: "red",
        stopOnFocus: true, // Prevents dismissing of toast on hover
      }).showToast();
    }
    fetchData();
  }

  return (
    <div className="App">
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
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
        </>
      )}
      <h2>Score:{score}</h2>
    </div>
  );
}

export default App;
