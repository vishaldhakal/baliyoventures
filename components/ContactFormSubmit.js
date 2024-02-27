import axios from "axios";
import swal from "sweetalert";

async function ContactFormSubmit(msgdata, setSubmitbtn, setCredentials) {
  let baseUrl = "https://api.dolphy.ca";
  setSubmitbtn("Submitting...");
  let form_data = new FormData();
  form_data.append("name", msgdata.name);
  form_data.append("email", msgdata.email);
  form_data.append("phone", msgdata.phone);
  form_data.append("message", msgdata.message);
  let url = `${baseUrl}/api/contact-form-submission/`;
  try {
    await axios.post(url, form_data, {
      headers: {
        "content-type": "multipart/form-data",
      },
      mode: "no-cors",
    });
    setSubmitbtn("Sucessfully Submitted");
    setTimeout(() => {
      setSubmitbtn("Contact Now");
    }, 1000);
    setCredentials({
      ...msgdata,
      name: "",
      phone: "",
      email: "",
      message: "",
    });
  } catch (errr) {
    console.log(errr);
    setSubmitbtn("Contact Now");
    swal("Message Failed", "Cannot send your message", "error");
    throw new Error(errr);
  }
}

export default ContactFormSubmit;
