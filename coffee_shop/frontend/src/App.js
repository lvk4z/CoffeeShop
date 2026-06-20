import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import HomePage from "./components/HomePage";
import { Provider } from "react-redux";
import { store } from "./redux/app/store";
import theme from "./theme";

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HomePage />
    </ThemeProvider>
  </Provider>
);

const appDiv = document.getElementById("app");
ReactDOM.render(<App />, appDiv);

export default App;

