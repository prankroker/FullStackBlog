import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function Profile() {
  let { id } = useParams();
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((response) => {
      setUsername(response.data.username);
    });
    axios.get(`http://localhost:3001/posts/byUserId/${id}`).then((response) => {
      setPosts(response.data);
    });
  }, []);
  return (
    <div className="profilePageContainer">
      <div className="basicInfo">Username: {username}</div>
      <h2>List of all posts created by this user:</h2>
      <div className="listOfPosts">
        {posts.map((item) => {
          return (
            <div className="Post">
              <div className="PostTitle">{item.title}</div>
              <div
                className="PostText"
                onClick={() => {
                  navigate(`/post/${item.id}`);
                }}
              >
                {item.postText}
              </div>
              <div className="PostUsername">{item.username}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
