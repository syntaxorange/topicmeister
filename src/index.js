import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';

class App extends React.Component {
  render() {
    return (
      <h1>Topic Meister</h1>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);