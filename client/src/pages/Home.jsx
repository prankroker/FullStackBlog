import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router";
import { AuthContext } from "../helpers/AuthContext";
import ThumbsUp3 from "../assets/thumb_up";
import ThumbsUp3act from "../assets/thumb_up_active";
import QuestionMarkCircle from "../assets/question_mark";

function Home() {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  let location = useLocation();

  useEffect(() => {
    if (!authState.status) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:3001/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setPosts(response.data.listOfPosts);
          setLikedPosts(
            response.data.likedPosts.map((like) => {
              return like.PostId;
            })
          );
        });
    }
  }, []);

  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        setPosts(
          posts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArr = post.Likes;
                likesArr.pop();
                return { ...post, Likes: likesArr };
              }
            } else {
              return post;
            }
          })
        );
      });

    if (likedPosts.includes(postId)) {
      setLikedPosts(
        likedPosts.filter((id) => {
          return id != postId;
        })
      );
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  const toProfile = (UserId) => {
    navigate(`/profile/${UserId}`);
  };

  let navigate = useNavigate();
  return (
    <>
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
            <div className="PostUsername">
              <label
                className="username"
                onClick={() => toProfile(item.UserId)}
              >
                {item.username}
              </label>
              <button
                className="like"
                onClick={() => {
                  likeAPost(item.id);
                }}
              >
                {likedPosts.includes(item.id) ? (
                  <ThumbsUp3act />
                ) : (
                  <ThumbsUp3 />
                )}
              </button>
              <label>{item.Likes.length}</label>
            </div>
          </div>
        );
      })}
      {authState.status && location.pathname !== "/chatbot" && (
        <div className="AI">
          <button
            className="question"
            onClick={() => window.location.replace("/chatbot")}
          >
            <QuestionMarkCircle />
          </button>
        </div>
      )}
    </>
  );
}

export default Home;
