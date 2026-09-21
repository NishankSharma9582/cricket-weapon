import React from "react";
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import store from "./store";
import App from "./App";
// Replace BrowserRouter import with HashRouter
import { HashRouter } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: { main: "#ED1C24", dark: "#B80504", light: "#FF3B43" },
    secondary: { main: "#121212" },
  },
  typography: { fontFamily: ["Archivo", "system-ui", "sans-serif"].join(",") },
});
const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE,
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <>
    {/* Wrap the application with HashRouter for mobile routing support */}
    <HashRouter>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <AlertProvider template={AlertTemplate} {...options}>
            <App />
          </AlertProvider>
        </Provider>
      </ThemeProvider>
    </HashRouter>
  </>,
);
