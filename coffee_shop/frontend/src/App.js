import React, { Component } from "react";
import ReactDOM from "react-dom";
import HomePage from "./components/HomePage";
import { Provider } from "react-redux";
import { store } from "./redux/app/store";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <div className="middle-card">
          <HomePage />
        </div>
      </Provider>
    );
  }
}

const appDiv = document.getElementById("app");
ReactDOM.render(<App />, appDiv);

export default App;
