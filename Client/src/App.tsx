import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SocketProvider } from "./contexts/SocketContext";
import { MainLayout } from "./components/Layout/MainLayout";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import SSOCallback from "./pages/SSOCallback";

function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />
              <Route path="/sso-callback" element={<SSOCallback />} />
              <Route path="/create-post" element={<MainLayout />} />
              <Route path="/user/:userId" element={<MainLayout />} />
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
