import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import netlifyIdentity from "netlify-identity-widget";

function App() {
  const [apiResponse, setApiResponse] = useState();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    netlifyIdentity.init();

    fetch("/.netlify/functions/hello")
      .then((response) => response.text())
      .then((data) => {
        setApiResponse(data);
      })
      .catch((err) => {
        console.log(err);
      });
    fetch("/.netlify/functions/data")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // eslint-disable-next-line no-unused-vars
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
    <>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <p>
            API Response: <code>{apiResponse}</code>
          </p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Image</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                return (
                  <tr key={"row" + i}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.image}</td>
                    <td>{p.category}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div>
            <button
              type="button"
              onClick={() => netlifyIdentity.open("signup")}
            >
              Sign Up
            </button>
            <button type="button" onClick={() => netlifyIdentity.open("login")}>
              Login
            </button>
          </div>
        </header>
      </div>
    </>
  );
}

export default App;
