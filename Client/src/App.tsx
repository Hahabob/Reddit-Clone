import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SocketProvider } from "./contexts/SocketContext";
import { MainLayout } from "./components/Layout/MainLayout";
import SignUpPage from "./pages/signup";
import SignInPage from "./pages/signin";

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
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="/sign-in" element={<SignInPage />} />
            </Routes>
          </div>
        </Router>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;
