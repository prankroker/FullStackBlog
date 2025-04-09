import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { useNavigate } from "react-router";

function CreatePost() {
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();
  useEffect(() => {
    if (!authState.status) {
      navigate("/login");
    }
  }, []);
  const initialValues = {
    title: "",
    postText: "",
    username: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    postText: Yup.string().required(),
  });

  function handleSubmit(data) {
    axios
      .post("http://localhost:3001/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/");
      });
  }

  return (
    <div className="FormContainer">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <Form>
          <label>Title:</label>
          <ErrorMessage name="title" component="span" />
          <Field id="inputCreatePost" name="title" placeholder="Enter title:" />
          <label>Post text:</label>
          <ErrorMessage name="postText" component="span" />
          <Field
            id="inputCreatePost"
            name="postText"
            placeholder="Enter post text:"
          />

          <button className="button" type="submit">
            Create Post!
          </button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
