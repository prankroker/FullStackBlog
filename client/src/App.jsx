import { BrowserRouter as Router, Route, Routes, Link } from "react-router";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PageNotFound from "./pages/PageNotFound";
import { AuthContext } from "./helpers/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import ChangePassword from "./pages/ChangePassword";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      username: "",
      id: 0,
      status: false,
    });
    window.location.replace("/login");
  };

  return (
    <>
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            {!authState.status ? (
              <>
                <Link to={"/login"}>Login</Link>
                <Link to={"/registration"}>Registration</Link>
              </>
            ) : (
              <>
                <Link to={"/createpost"}>Create post</Link>
                <Link to={"/"}>Homepage</Link>
              </>
            )}
            <Link to={`/profile/${authState.id}`}>{authState.username}</Link>
            {authState.status && <button onClick={logout}>Logout</button>}
          </div>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/createpost" exact element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/registration" exact element={<Registration />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/profile/:id" exact element={<Profile />} />
            <Route path="/changePassword" exact element={<ChangePassword />} />
            <Route path="*" element={<PageNotFound />} /> //this one is for 404
          </Routes>
        </Router>
      </AuthContext.Provider>
    </>
  );
}

export default App;
