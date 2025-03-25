import { BrowserRouter as Router, Route, Routes, Link } from "react-router";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";

function App() {
  return (
    <>
      <Router>
        <div className="navbar">
          <Link to={"/createpost"}>Create post</Link>
          <Link to={"/"}>Homepage</Link>
        </div>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/createpost" exact element={<CreatePost />} />
          <Route path="/post/:id" element={<Post />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
