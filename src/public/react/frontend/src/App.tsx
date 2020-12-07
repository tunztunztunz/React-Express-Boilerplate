import React from 'react';

const server = process.env.REACT_APP_PROJECT_SERVER ? process.env.REACT_APP_PROJECT_SERVER : '';

function App() {
  const callExpress = async () => {
    try {
      const response = await fetch(`${server}/api/hello`).then((res) => res.json());
      alert('Hi, this is a response from the backend: ' + response.message);
    } catch (err) {
      alert('Doesnt look like the connection is working');
    }
  };
  return (
    <div>
      <h1>React/Express Boilerplate</h1>
      <button type="button" onClick={callExpress}>
        Test the backend connection
      </button>
    </div>
  );
}

export default App;
