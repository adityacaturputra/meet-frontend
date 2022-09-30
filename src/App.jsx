import ZoomVideo from "@zoom/videosdk";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Error404 from "./Components/Errors/404";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import ZoomContext from "./Contexts/ZoomContext";
import MeetFinished from "./Modules/ZoomMeeting/Pages/MeetFinished";
import MeetLandingPage from "./Modules/ZoomMeeting/Pages/MeetLandingPage";

function App() {
  document.title = "Pelindo Meet";

  let zmClient = null;
  zmClient = ZoomVideo.createClient();

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route
          path="meeting"
          element={
            <ZoomContext.Provider value={zmClient}>
              <MeetLandingPage />
            </ZoomContext.Provider>
          }
        />
        <Route path="end" element={<MeetFinished />} />
        {/* Errors */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
