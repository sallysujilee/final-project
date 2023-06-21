import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../components/AppContext';
import './ServicesFormPage.css';

export default function ServiceForm() {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  console.log(user.userId);
  useEffect(() => {
    if (!user) navigate('/sign-in');
  }, [user, navigate]);

  function handleSubmit(e) {
    e.preventDefault();

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
      price = 24000;
    } else if (service === 'graphic-design') {
      price = 15000;
    } else {
      price = 40000;
    }

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
    document.getElementById('form-container').reset();
  }
  return (
    <div className="service-form-container">
      <form
        action={`/create-checkout-session/${user.userId}`}
        method="POST"
        className="form-container"
        id="form-container"
        // onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label className="form-label">
            <div className="form-title-text">First Name</div>
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
            <div className="form-title-text">Last Name</div>
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
            <div className="form-title-text">Company Name</div>
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
            <div className="form-title-text">Email</div>
            <input
              required
              autoFocus
              type="email"
              name="email"
              className="form-control bg-light"
              placeholder="Text here"
            />
          </label>
        </div>
        <div className="mb-4">
          <div className="form-title-text">Service of choice</div>
          <select name="service" className="select-list">
            <option value="default" className="default-list">
              -- Select an option --
            </option>
            <option value="Photography">
              Photography ($240 one day session)
            </option>
            <option value="Graphic Design">Graphic Design ($150)</option>
            <option value="Web Development">Web Development ($400)</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="form-label">
            <div className="form-title-text">Describe purpose of service</div>
            <input
              required
              autoFocus
              type="text"
              name="description"
              className="form-control bg-light big-text-box"
              placeholder="Describe purpose here."
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="form-label">
            <div className="form-title-text">References</div>
            <input
              required
              autoFocus
              type="text"
              name="references"
              className="form-control bg-light big-text-box"
              placeholder="List references here."
            />
          </label>
        </div>
        <small>
          <div className="sign-in-line">
            <div className="agreement-text">
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
