import React, { useEffect, useState } from "react";
import "./Story.css";
import axios from "axios";
import ModeSharpIcon from "@mui/icons-material/ModeSharp";

const Weather = () => {
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [generateStory, setGenerateStory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editStates, setEditStates] = useState([]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const savedStories = localStorage.getItem("stories");
    if (savedStories) {
      setGenerateStory(JSON.parse(savedStories));
      setEditStates(new Array(JSON.parse(savedStories).length).fill(false));
    }
  }, []);

  const saveStoriesToLocalStorage = (stories) => {
    localStorage.setItem("stories", JSON.stringify(stories));
  };

  const fetchData = async () => {
    try {
      if (!city || !name || !age) {
        alert("Please fill in all fields.");
        return;
      }

      setIsLoading(true);

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2962506766620332d7bd1780f3fbe4c1`
      );

      const weatherData = response.data;
      const currentDate = new Date();

      let bio = "";
      if (5 <= age && age <= 15) {
        bio =
          "he/she came here to spend his/her Summer Holidays with his grandmother";
      } else if (15 < age && age < 25) {
        bio =
          "he/she came here to spend his/her Semester Holidays doing Internship";
      } else if (25 <= age && age <= 80) {
        bio =
          "he/she came here with his/her family to spend his/her Vacation Holidays";
      } else {
        alert("Age must be within an acceptable range (5-80).");
        setIsLoading(false);
        return;
      }

      const newStory = ` ${name} is ${age} years old and is living in ${
        weatherData.name
      }, located in ${
        weatherData.sys.country
      }, ${bio}. To be exact, he/she is at a coordinate of ${Math.round(
        weatherData.coord.lon
      )}' Longitude, ${Math.round(
        weatherData.coord.lat
      )}' Latitude. The weather is ever-changing, and today's forecast (${currentDate.getDate()}-${
        months[currentDate.getMonth()]
      }-${currentDate.getFullYear()}) is ${
        weatherData.weather[0].description
      } where the temperature is ${Math.round(
        weatherData.main.temp - 273.15
      )}ºC. It's a reminder that nature is full of surprises.`;
      const updatedStories = [...generateStory, newStory];
      setGenerateStory(updatedStories);
      saveStoriesToLocalStorage(updatedStories);

      const updatedEditStates = [...editStates, false];
      setEditStates(updatedEditStates);
      setCity("");
      setName("");
      setAge("");
      setIsLoading(false);
    } catch (err) {
      setErrorMessage("Please enter a valid city.");
      setIsLoading(false);
    }
  };

  const updateStoryInLocalStorage = (index, updatedStory) => {
    const updatedStories = [...generateStory];
    updatedStories[index] = updatedStory;
    saveStoriesToLocalStorage(updatedStories);
    setGenerateStory(updatedStories);
  };

  const toggleEdit = (index) => {
    const updatedEditStates = [...editStates];
    updatedEditStates[index] = !updatedEditStates[index];
    setEditStates(updatedEditStates);
  };

  const handleStoryEdit = (index, editedStory) => {
    toggleEdit(index);
    updateStoryInLocalStorage(index, editedStory);
  };

  const deleteStory = (index) => {
    const updatedStories = [...generateStory];
    updatedStories.splice(index, 1);
    setGenerateStory(updatedStories);
    saveStoriesToLocalStorage(updatedStories);
    const updatedEditStates = [...editStates];
    updatedEditStates.splice(index, 1);
    setEditStates(updatedEditStates);
  };

  return (
    <div className="container-box">
      <div className="cont-one">
        <div className="container">
          <div className="title">
            <h1>RANDOM STORY</h1>
            <div className="row">
              <input
                type="text"
                placeholder="Character name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="number"
                min="1"
                max="80"
                placeholder=" age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <input
                className="input"
                type="text"
                placeholder="Story held in (City name)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <button onClick={fetchData} disabled={isLoading}>
                {isLoading ? "Generating..." : "GENERATE STORY"}
              </button>
            </div>
            {errorMessage && <div className="error">{errorMessage}</div>}
          </div>
        </div>
      </div>
      <div className="cont">
        <ul>
          {generateStory.map((story, index) => (
            <div key={index}>
              <h3>STORY {index + 1} </h3>

              {editStates[index] ? (
                <li
                  contentEditable={true}
                  onBlur={(e) => handleStoryEdit(index, e.target.textContent)}
                >
                  {story}
                </li>
              ) : (
                <li> {story}</li>
              )}

              <div className="edit-delete">
                <div className="edit" onClick={() => toggleEdit(index)}>
                  {editStates[index] ? (
                    <button className="save">save</button>
                  ) : (
                    <ModeSharpIcon />
                  )}
                </div>
                <button className="delete" onClick={() => deleteStory(index)}>
                  Delete
                </button>
              </div>
              <hr className="line" />
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Weather;
