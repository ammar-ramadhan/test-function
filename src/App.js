import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [apiResponse, setApiResponse] = useState();

  useEffect(() => {
    fetch("/.netlify/functions/hello")
      .then((response) => response.text())
      .then((data) => {
        setApiResponse(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function fetchIncrement(event) {
    event.preventDefault();
    fetch("/.netlify/functions/increment", {
      method: "POST",
      body: JSON.stringify({
        counter: parseInt(event.target.elements.counter.value),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setApiResponse(data.counter);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <form onSubmit={fetchIncrement}>
          <input name="counter" type="text"></input>
          <button>Submit</button>
        </form>
        <p>
          API Response: <code>{apiResponse}</code>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
