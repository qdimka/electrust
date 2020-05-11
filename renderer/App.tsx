import React from 'react';
import './App.css';

const client = new WebSocket('ws://localhost:9999');

function App() {
  client.onopen = (e) => {
    client.send("Hello");
  };
  client.onmessage = (m) => console.log(m);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
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
