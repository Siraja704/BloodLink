import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

const RegistrationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  bloodType: Yup.string().required("Blood Type is required"),
  location: Yup.string().required("Location is required"),
  phone: Yup.string().required("Phone Number is required"),
});

const RegistrationPage = () => {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  return (
    <div className="page-container">
      <div className="donor-section">
        <h1>Register</h1>
        <Formik
          initialValues={{
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            bloodType: "",
            location: "",
            phone: "",
          }}
          validationSchema={RegistrationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setMessage("");
            setSuccess(false);
            try {
              const res = await fetch(
                "http://localhost:3000/api/auth/register",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                }
              );
              const data = await res.json();
              if (data.success) {
                setSuccess(true);
                setMessage("Registration successful!");
                // Store user data and token in localStorage
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                  window.location.href = "/user";
                }, 1500);
                resetForm();
              } else {
                setMessage(data.message || "Registration failed");
              }
            } catch (err) {
              setMessage("Server error");
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="donor-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <Field
                  type="text"
                  name="fullName"
                  placeholder="e.g. Ahmed Khan"
                />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="form-error"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="form-error"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="form-error"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="form-error"
                />
              </div>
              <div className="form-group">
                <label htmlFor="bloodType">Blood Type</label>
                <Field as="select" name="bloodType">
                  <option value="">Select blood type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </Field>
                <ErrorMessage
                  name="bloodType"
                  component="div"
                  className="form-error"
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <Field
                  type="text"
                  name="location"
                  placeholder="e.g. Karachi, Lahore, Sukkur"
                />
                <ErrorMessage
                  name="location"
                  component="div"
                  className="form-error"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <Field
                  type="text"
                  name="phone"
                  placeholder="e.g. +92 300 1234567"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="form-error"
                />
              </div>
              <button
                type="submit"
                className="btn primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
              {message && (
                <div
                  style={{
                    color: success ? "green" : "red",
                    marginTop: "1rem",
                  }}
                >
                  {message}
                </div>
              )}
              <div style={{ marginTop: "1rem", fontSize: "0.95rem" }}>
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{ color: "#e63946", textDecoration: "underline" }}
                >
                  Login
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegistrationPage;
