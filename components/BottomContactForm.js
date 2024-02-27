"use client";
import { useState } from "react";
import ContactFormSubmit from "./ContactFormSubmit";
import { useRouter } from "next/navigation";

export default function BottomContactForm(props) {
  const [submitbtn, setSubmitbtn] = useState("Send a message");
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    name: "",
    phone: "",
    email: "",
    message: props.defaultmessage,
  });
  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(credentials);
    ContactFormSubmit(credentials, setSubmitbtn, setCredentials)
      .then((res) => router.push("/thank-you"))
      .catch((err) => console.log(err));
  };
  return (
    <form
      method="POST"
      className="mb-2"
      onSubmit={(e) => handleFormSubmit(e)}
      id="contactForm"
    >
      <div className="row me-0 row-cols-2 g-4 me-0">
        <div className="col mb-2">
          <input
            type="text"
            placeholder="Name"
            name="name"
            id="name"
            value={credentials.name}
            onChange={(e) => handleChange(e)}
            className="fields fff"
          />
        </div>
        <div className="col">
          <div className="mb-2">
            <input
              type="text"
              name="phone"
              id="phone"
              placeholder="Phone"
              value={credentials.phone}
              onChange={(e) => handleChange(e)}
              required={true}
              className="fields fff"
            />
          </div>
        </div>
      </div>
      <div className="row me-0 row-cols-1">
        <div className="col">
          <div className="mb-2">
            <input
              type="email"
              aria-describedby="emailHelp"
              placeholder="Your email"
              name="email"
              id="email"
              value={credentials.email}
              onChange={(e) => handleChange(e)}
              className="fields fff"
            />
          </div>
        </div>
      </div>
      <div className="row me-0">
        <div className="mb-2">
          <textarea
            id="message"
            name="message"
            className="fields fff mess"
            rows="3"
            cols="50"
            placeholder="Enter your message here"
            value={credentials.message}
            onChange={(e) => handleChange(e)}
          ></textarea>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <input
          type="submit"
          value={submitbtn}
          className="btn btn-yel shadow-lg btn-lg mb-2 w-100"
          id="subbtn"
        />
      </div>
    </form>
  );
}
