import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

const RegistrationPage = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [isPaidDonor, setIsPaidDonor] = useState(false);
  const [locationCoords, setLocationCoords] = useState({
    lat: null,
    lng: null,
  });
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const API_BASE = "http://localhost:3000/api";

  const initialValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    bloodType: "",
    location: "",
    phone: "",
    contactPublic: false,
    isPaidDonor: false,
    chargeAmount: 0,
    userType: "",
    locationCoords: { lat: null, lng: null },
  };

  const RegistrationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm your password"),
    phone: Yup.string().required("Phone is required"),
    location: Yup.string().required("Location is required"),
    bloodType: Yup.string().when("userType", {
      is: (val) => val === "donor" || val === "need" || val === "both",
      then: Yup.string().required("Blood type is required"),
    }),
    chargeAmount: Yup.number().when(["isPaidDonor", "userType"], {
      is: (isPaid, type) => isPaid && (type === "donor" || type === "both"),
      then: Yup.number()
        .min(1, "Charge must be at least $1")
        .required("Charge amount required for paid donors"),
      otherwise: Yup.number(),
    }),
  });

  const handleLocation = (setFieldValue) => {
    setLocationLoading(true);
    setLocationError("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setFieldValue("locationCoords", {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLocationLoading(false);
        },
        (err) => {
          setLocationError("Failed to get location: " + err.message);
          setLocationLoading(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
      setLocationLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="donor-section">
        <h1>Register</h1>
        {step === 1 && (
          <div className="user-type-step">
            <h2>Register as:</h2>
            <button
              className={`btn ${
                userType === "donor" ? "primary" : "secondary"
              }`}
              onClick={() => {
                setUserType("donor");
                setStep(2);
              }}
            >
              Donor
            </button>
            <button
              className={`btn ${userType === "need" ? "primary" : "secondary"}`}
              onClick={() => {
                setUserType("need");
                setStep(2);
              }}
            >
              Need Blood
            </button>
            <button
              className={`btn ${userType === "both" ? "primary" : "secondary"}`}
              onClick={() => {
                setUserType("both");
                setStep(2);
              }}
            >
              Both
            </button>
          </div>
        )}
        {step === 2 && (
          <Formik
            initialValues={{ ...initialValues, userType, isPaidDonor }}
            validationSchema={RegistrationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              setMessage("");
              setSuccess(false);
              try {
                const res = await fetch(`${API_BASE}/auth/register`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ ...values, locationCoords }),
                });
                const data = await res.json();
                if (data.success) {
                  setSuccess(true);
                  setMessage("Registration successful!");
                  localStorage.setItem("user", JSON.stringify(data.user));
                  localStorage.setItem("token", data.token);
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
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="donor-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <Field name="fullName" />
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <Field name="email" type="email" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <Field name="password" type="password" />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <Field name="confirmPassword" type="password" />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <Field name="phone" />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label>Location (Address)</label>
                  <Field name="location" />
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="error"
                  />
                  <button
                    type="button"
                    className="btn secondary"
                    style={{ marginTop: "0.5rem" }}
                    onClick={() => handleLocation(setFieldValue)}
                  >
                    Use My Current Location
                  </button>
                  {locationLoading && (
                    <span style={{ marginLeft: "1rem", color: "#1d3557" }}>
                      Getting location...
                    </span>
                  )}
                  {locationError && (
                    <div style={{ color: "red", marginTop: "0.5rem" }}>
                      {locationError} (You can still register by entering your
                      address above.)
                    </div>
                  )}
                  {values.locationCoords.lat && values.locationCoords.lng && (
                    <div
                      style={{
                        fontSize: "0.95rem",
                        color: "#1d3557",
                        marginTop: "0.5rem",
                      }}
                    >
                      Lat: {values.locationCoords.lat.toFixed(5)}, Lng:{" "}
                      {values.locationCoords.lng.toFixed(5)}
                    </div>
                  )}
                </div>
                {(userType === "donor" ||
                  userType === "need" ||
                  userType === "both") && (
                  <div className="form-group">
                    <label>Blood Type</label>
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
                      className="error"
                    />
                  </div>
                )}
                {(userType === "donor" || userType === "both") && (
                  <>
                    <div className="form-group">
                      <label>
                        <Field type="checkbox" name="contactPublic" />
                        Make my contact info public
                      </label>
                    </div>
                    <div className="form-group">
                      <label>
                        <Field
                          type="checkbox"
                          name="isPaidDonor"
                          checked={values.isPaidDonor}
                          onChange={(e) => {
                            setFieldValue("isPaidDonor", e.target.checked);
                            setIsPaidDonor(e.target.checked);
                          }}
                        />
                        I want to charge for donation
                      </label>
                      {values.isPaidDonor && (
                        <Field
                          name="chargeAmount"
                          type="number"
                          min="1"
                          placeholder="Charge Amount ($)"
                        />
                      )}
                      <ErrorMessage
                        name="chargeAmount"
                        component="div"
                        className="error"
                      />
                    </div>
                  </>
                )}
                <button
                  type="submit"
                  className="btn primary"
                  disabled={isSubmitting}
                >
                  Register
                </button>
                <button
                  type="button"
                  className="btn secondary"
                  style={{ marginLeft: "1rem" }}
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                {message && (
                  <div
                    style={{
                      marginTop: "1rem",
                      color: success ? "green" : "red",
                    }}
                  >
                    {message}
                  </div>
                )}
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default RegistrationPage;
