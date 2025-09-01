import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SocketProvider } from "./contexts/SocketContext";
import { MainLayout } from "./components/Layout/MainLayout";

function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<MainLayout />} />
              <Route path="/r/:subreddit" element={<MainLayout />} />
              <Route
                path="/r/:subreddit/comments/:postId"
                element={<MainLayout />}
              />
            </Routes>
          </div>
        </Router>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;
