import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../helpers/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);

  const handleSubmit = () => {
    const data = { username: username, password: password };
    axios.post("http://localhost:3001/auth/login", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        localStorage.setItem("accessToken", response.data.token);
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
        navigate("/");
      }
    });
  };

  let navigate = useNavigate();
  return (
    <div>
      <input
        type="text"
        placeholder="Enter username:"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      ></input>
      <input
        type="password"
        placeholder="Enter password:"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      ></input>
      <button onClick={handleSubmit}>Login!</button>
    </div>
  );
}

export default Login;
