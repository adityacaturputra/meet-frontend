import NiceModal from "@ebay/nice-modal-react";
import { createEmotionCache, MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import { persistedStore, store } from "./Configs/Redux/store";
import "./index.css";

const MANTINE_PRIMARY_COLOR = [
  "#CBEBFF",
  "#88D2FF",
  "#4EBCFF",
  "#1CA9FF",
  "#0096F9",
  "#0080D3",
  "#016DB2",
  "#005B96",
  "#004C7D",
  "#003F68",
  "#003456",
];

const myCache = createEmotionCache({ key: "mantine" });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <MantineProvider
          emotionCache={myCache}
          theme={{
            fontFamily: "Inter, Roboto, system-ui",
            colors: {
              primary: MANTINE_PRIMARY_COLOR,
            },
            primaryColor: "primary", // key of theme.colors
            respectReducedMotion: true,
          }}
          inherit
        >
          <NiceModal.Provider>
            <App />
          </NiceModal.Provider>
        </MantineProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
