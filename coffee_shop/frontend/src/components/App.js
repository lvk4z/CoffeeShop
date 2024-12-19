import React, { Component } from "react";
import ReactDOM from "react-dom";
import HomePage from "./HomePage";
import Navbar from "./Navbar";

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  

  render() {
    return (
      <div className="center">
        
        
        <div className="middle-card">
          <HomePage />
        </div>
      </div>
    );
  } 
}

const appDiv = document.getElementById("app");
ReactDOM.render(<App />, appDiv);
