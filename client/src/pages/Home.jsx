import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/posts").then((response) => {
      setPosts(response.data);
    });
  }, []);

  let navigate = useNavigate();
  return (
    <>
      {posts.map((item) => {
        return (
          <div
            className="Post"
            onClick={() => {
              navigate(`/post/${item.id}`);
            }}
          >
            <div className="PostTitle">{item.title}</div>
            <div className="PostText">{item.postText}</div>
            <div className="PostUsername">{item.username}</div>
          </div>
        );
      })}
    </>
  );
}

export default Home;
