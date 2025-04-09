import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

function Registration() {
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(1).max(20).required(),
    password: Yup.string().min(4).max(20).required(),
  });

  const handleSubmit = (data) => {
    axios.post("http://localhost:3001/auth", data);
  };

  return (
    <div className="FormContainer">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <Form>
          <label>Username:</label>
          <ErrorMessage name="username" component="span" />
          <Field
            id="inputCreatePost"
            name="username"
            placeholder="Enter username:"
          />
          <label>Password:</label>
          <ErrorMessage name="password" component="span" />
          <Field
            id="inputCreatePost"
            type="password"
            name="password"
            placeholder="Enter password:"
          />
          <button className="button" type="submit">
            Register
          </button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;
