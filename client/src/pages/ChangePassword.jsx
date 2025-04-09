import React, { useState } from "react";
import axios from "axios";

function ChangePassword() {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const changePass = () => {
    axios
      .put(
        "http://localhost:3001/auth/changePassword",
        { oldPass: oldPass, newPass: newPass },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        }
      });
  };
  return (
    <div>
      <h1>Change password</h1>
      <input
        type="password"
        placeholder="Enter your old password"
        onChange={(event) => {
          setOldPass(event.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Enter your new password"
        onChange={(event) => {
          setNewPass(event.target.value);
        }}
      />
      <button className="button" onClick={changePass}>
        Submit
      </button>
    </div>
  );
}

export default ChangePassword;
