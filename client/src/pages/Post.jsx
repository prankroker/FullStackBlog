import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Post() {
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [label, setLabel] = useState("Enter your comment:");
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  let { id } = useParams();
  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPost(response.data);
    });
    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);
  const handleSubmit = () => {
    if (newComment.length > 1) {
      axios
        .post(
          `http://localhost:3001/comments`,
          {
            commentText: newComment,
            PostId: id,
          },
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        )
        .then((response) => {
          if (response.data.error) {
            alert(response.data.error);
          } else {
            const commentToAdd = {
              commentText: newComment,
              username: response.data.username,
            };
            setComments([...comments, commentToAdd]);
            setNewComment("");
            setLabel("Enter your comment:");
          }
        });
    } else {
      setLabel("Enter comment with length > than 1");
    }
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        setComments(
          comments.filter((comment) => {
            return comment.id != id;
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/");
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter new title:");
      if (newTitle) {
        axios
          .put(
            "http://localhost:3001/posts/updateTitle",
            { newTitle: newTitle, id: post.id },
            {
              headers: { accessToken: localStorage.getItem("accessToken") },
            }
          )
          .then((response) => {
            setPost({ ...post, title: response.data });
          });
      }
    } else {
      let newPostText = prompt("Enter new text:");
      if (newPostText) {
        axios
          .put(
            "http://localhost:3001/posts/updateText",
            { newText: newPostText, id: post.id },
            {
              headers: { accessToken: localStorage.getItem("accessToken") },
            }
          )
          .then((response) => {
            setPost({ ...post, postText: response.data });
          });
      }
    }
  };

  const toProfile = (username) => {
    axios
      .get(`http://localhost:3001/auth/userinfo/${username}`)
      .then((response) => {
        navigate(`/profile/${response.data.id}`);
      });
  };

  return (
    <>
      <div className="Post">
        <div
          className="PostTitle"
          onClick={() => {
            if (authState.username === post.username) {
              editPost("title");
            }
          }}
        >
          {post.title}
        </div>
        <div
          className="PostText"
          onClick={() => {
            if (authState.username === post.username) {
              editPost("text");
            }
          }}
        >
          {post.postText}
        </div>
        <div
          className="PostUsername username"
          onClick={() => {
            toProfile(post.username);
          }}
        >
          {post.username}{" "}
          {authState.username === post.username && (
            <button onClick={() => deletePost(post.id)}>X</button>
          )}
        </div>
      </div>
      <div className="Comments">
        <div className="CreateComment">
          <label>{label}</label>
          <input
            className="CommentInput"
            type="text"
            placeholder="Enter your comment: "
            autoComplete="off"
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          ></input>
          <button
            className="CommentButton"
            type="submit"
            onClick={handleSubmit}
          >
            Create comment
          </button>
        </div>
        <div className="CommentSection">
          {comments.map((comment) => {
            return (
              <div className="Comment">
                {comment.commentText}
                <p
                  onClick={() => {
                    toProfile(comment.username);
                  }}
                  className="username"
                >
                  username: {comment.username}
                </p>
                {authState.username === comment.username && (
                  <button onClick={() => deleteComment(comment.id)}>X</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Post;
