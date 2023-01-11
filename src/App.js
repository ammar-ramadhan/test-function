import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
// import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import firebase from "firebase";
import { auth } from "firebaseui";
import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
// import "firebase/compat/firestore";
// import netlifyIdentity from "netlify-identity-widget";

function App() {
  const [apiResponse, setApiResponse] = useState();
  const [products, setProducts] = useState([]);
  const [isSignedIn, setSignedIn] = useState(false);

  var authUI = getAuth();
  authUI.onAuthStateChanged(
    function (user) {
      if (user) {
        setSignedIn(true);
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var uid = user.uid;
        var phoneNumber = user.phoneNumber;
        var providerData = user.providerData;
        user.getIdToken().then(function (accessToken) {
          document.getElementById("sign-in-status").textContent = "Signed in";
          document.getElementById("account-details").textContent =
            JSON.stringify(
              {
                displayName: displayName,
                email: email,
                emailVerified: emailVerified,
                phoneNumber: phoneNumber,
                photoURL: photoURL,
                uid: uid,
                accessToken: accessToken,
                providerData: providerData,
              },
              null,
              "  "
            );
        });
      } else {
        setSignedIn(false);
        // User is signed out.
        document.getElementById("sign-in-status").textContent = "Signed out";
        document.getElementById("account-details").textContent = "null";
      }
    },
    function (error) {
      console.log(error);
    }
  );

  useEffect(() => {
    var uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          console.log(authResult);
          return true;
        },
        uiShown: function () {},
      },
      signInSuccessUrl: "/",
      signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
    };

    var ui = auth.AuthUI.getInstance() || new auth.AuthUI(authUI);
    ui.start("#firebaseui-auth-container", uiConfig);

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
  }, [authUI]);

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
          {!isSignedIn && (
            <div
              style={{
                border: "1px solid white",
                padding: "50px",
                width: "50vw",
              }}
            >
              <div id="firebaseui-auth-container"></div>
            </div>
          )}
          <div
            style={{
              border: "1px solid white",
              padding: "50px",
              width: "50vw",
            }}
          >
            <h1>Welcome to My Awesome App</h1>
            <div id="sign-in-status"></div>
            {isSignedIn && (
              <button
                type="button"
                onClick={() => {
                  authUI.signOut().then(() => {
                    alert("Sign Out Successfull!");
                  });
                }}
              >
                Sign Out
              </button>
            )}
            <pre
              id="account-details"
              style={{
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                textAlign: "left",
              }}
            ></pre>
          </div>
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
          <div></div>
        </header>
      </div>
    </>
  );
}

export default App;
