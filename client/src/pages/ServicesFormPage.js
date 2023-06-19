import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../components/AppContext';
import './ServicesPage.css';

export default function ServiceForm() {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  console.log(user.userId);
  useEffect(() => {
    if (!user) navigate('/sign-in');
  }, [user, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    // console.log("hello world")
    const formData = new FormData(e.target);
    const {
      companyName,
      email,
      firstName,
      lastName,
      references,
      description,
      service,
    } = Object.fromEntries(formData.entries());
    console.log(
      companyName,
      email,
      firstName,
      lastName,
      references,
      description,
      service
    );
    let price;
    if (service === 'photography') {
      price = 240;
    } else if (service === 'graphic-design') {
      price = 150;
    } else {
      price = 400;
    }
    //create objects for post req (create an object that's going to satisfy everything from the http req); implement user.id
    const postRequestObject = {
      firstName: firstName,
      lastName: lastName,
      companyName: companyName,
      email: email,
      description: description,
      references: references,
      serviceType: service,
      price: price,
    };
    // console.log("postRequestObject", postRequestObject)
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postRequestObject }),
    };
    async function postData() {
      await fetch(`api/orders/${user.userId}`, req);
    }
    postData();
  }
  return (
    <div className="service-form-container">
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label">
            First Name
            <input
              required
              autoFocus
              type="text"
              name="firstName"
              className="form-control bg-light username-input"
              placeholder="Text here"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="form-label">
            Last Name
            <input
              required
              type="text"
              name="lastName"
              className="form-control bg-light password-input"
              placeholder="Text here"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="form-label">
            Company Name
            <input
              required
              autoFocus
              type="text"
              name="companyName"
              className="form-control bg-light"
              placeholder="Text here"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="form-label">
            E-Mail
            <input
              required
              autoFocus
              type="text"
              name="email"
              className="form-control bg-light"
              placeholder="Text here"
            />
          </label>
        </div>
        <div className="mb-4">
          Please choose which service is needed
          <select name="service" className="selectList">
            <option value="default">-- Select an option --</option>
            <option value="photography">
              Photography ($240 one day session)
            </option>
            <option value="graphic-design">Graphic Design ($150)</option>
            <option value="web-dev">Web Development ($400)</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="form-label">
            Describe purpose of service
            <input
              required
              autoFocus
              type="text"
              name="description"
              className="form-control bg-light"
              placeholder="Please describe what the service is for and what I can do to help."
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="form-label">
            References
            <input
              required
              autoFocus
              type="text"
              name="references"
              className="form-control bg-light"
              placeholder="Please send links of references for the vision you have in mind."
            />
          </label>
        </div>
        <small>
          <div className="sign-in-line">
            <div className="have-account-line">
              This package contains a service that consists of a one time
              service charge. Should there be extra requirements, a fee will be
              added on after contacting the freelancer before the event takes
              place. Refund for the photography option is only given if it
              reaches the one week mark before the event date. Should you
              request a refund for the graphic design and web development
              options, only fifty percent will be given back. Should you click
              the submit button, you are agreeing to this disclaimer.
            </div>
          </div>
        </small>
        <div className="d-flex justify-content-between align-items-center">
          <button type="submit" className="btn btn-primary submit-button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
