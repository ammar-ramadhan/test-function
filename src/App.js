import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [apiResponse, setApiResponse] = useState();
  const [products, setProducts] = useState([]);

  useEffect(() => {
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
        <table>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Image</th>
            <th>Category</th>
          </tr>
          {products.map((p) => {
            return (
              <tr>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.image}</td>
                <td>{p.category}</td>
              </tr>
            );
          })}
        </table>
      </header>
    </div>
  );
}

export default App;
