import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const CreateRequestPage = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const initialValues = {
    patientName: "",
    bloodType: "",
    unitsRequired: 1,
    hospitalName: "",
    hospitalAddress: "",
    contactPerson: "",
    contactPhone: "",
    urgency: "Urgent",
    notes: "",
  };

  const validationSchema = Yup.object({
    patientName: Yup.string().required("Patient name is required"),
    bloodType: Yup.string().required("Blood type is required"),
    unitsRequired: Yup.number()
      .min(1, "At least one unit is required")
      .required("Number of units is required"),
    hospitalName: Yup.string().required("Hospital name is required"),
    hospitalAddress: Yup.string().required("Hospital address is required"),
    contactPerson: Yup.string().required("Contact person is required"),
    contactPhone: Yup.string().required("Contact phone is required"),
    urgency: Yup.string().required("Urgency level is required"),
    notes: Yup.string(),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setMessage("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Blood request created successfully!");
        setTimeout(() => navigate("/user"), 2000);
      } else {
        setMessage(data.message || "Failed to create request.");
      }
    } catch (err) {
      setMessage("Server error occurred.");
    }
    setSubmitting(false);
  };

  return (
    <div className="page-container">
      <h1>Create a Blood Request</h1>
      <p>Fill out the form below to request blood for a patient in need.</p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="form-container">
            <div className="form-group">
              <label htmlFor="patientName">Patient Full Name</label>
              <Field type="text" name="patientName" />
              <ErrorMessage
                name="patientName"
                component="div"
                className="error"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bloodType">Required Blood Type</label>
              <Field as="select" name="bloodType">
                <option value="">Select Blood Type</option>
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

            <div className="form-group">
              <label htmlFor="unitsRequired">Units Required</label>
              <Field type="number" name="unitsRequired" min="1" />
              <ErrorMessage
                name="unitsRequired"
                component="div"
                className="error"
              />
            </div>

            <div className="form-group">
              <label htmlFor="urgency">Urgency</label>
              <Field as="select" name="urgency">
                <option value="Urgent">Urgent</option>
                <option value="Within 24 hours">Within 24 hours</option>
                <option value="Within 3 days">Within 3 days</option>
              </Field>
              <ErrorMessage name="urgency" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="hospitalName">Hospital Name</label>
              <Field type="text" name="hospitalName" />
              <ErrorMessage
                name="hospitalName"
                component="div"
                className="error"
              />
            </div>

            <div className="form-group">
              <label htmlFor="hospitalAddress">Hospital Address</label>
              <Field type="text" name="hospitalAddress" />
              <ErrorMessage
                name="hospitalAddress"
                component="div"
                className="error"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactPerson">Contact Person</label>
              <Field type="text" name="contactPerson" />
              <ErrorMessage
                name="contactPerson"
                component="div"
                className="error"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactPhone">Contact Phone</label>
              <Field type="text" name="contactPhone" />
              <ErrorMessage
                name="contactPhone"
                component="div"
                className="error"
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Additional Notes</label>
              <Field as="textarea" name="notes" rows="4" />
              <ErrorMessage name="notes" component="div" className="error" />
            </div>

            <button
              type="submit"
              className="btn primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>

            {message && <p className="message">{message}</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateRequestPage;
