import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

function Post() {
  const [post, setPost] = useState({});
  let { id } = useParams();
  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPost(response.data);
    });
  }, []);
  return (
    <>
      <div className="Post">
        <div className="PostTitle">{post.title}</div>
        <div className="PostText">{post.postText}</div>
        <div className="PostUsername">{post.username}</div>
      </div>
      <div className="Comments">There will be comments!</div>
    </>
  );
}

export default Post;
