import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SocketProvider } from "./contexts/SocketContext";
import { MainLayout } from "./components/Layout/MainLayout";
import SignInPage from "./pages/signin";
import SignUpPage from "./pages/signup";
import SSOCallback from "./pages/SSOCallback";

function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Authentication routes */}
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />
              <Route path="/sso-callback" element={<SSOCallback />} />

              {/* Main routes - accessible to all, but with different UX based on auth status */}
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
