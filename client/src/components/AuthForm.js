import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUpOrIn } from '../lib';
import './AuthForm.css';

export default function AuthForm({ action, onSignIn }) {
  console.log(onSignIn);
  const navigate = useNavigate();
  const [error, setError] = useState();

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { userName, password, firstName, lastName, phoneNumber, email } =
      Object.fromEntries(formData.entries());
    try {
      const result = await signUpOrIn(
        action,
        userName,
        password,
        firstName,
        lastName,
        phoneNumber,
        email
      );
      if (action === 'sign-up') {
        navigate('/sign-in');
      } else if (result.user && result.token) {
        onSignIn(result);
      }
    } catch (err) {
      setError(err);
    }
  }

  const alternateActionTo = action === 'sign-up' ? '/sign-in' : '/sign-up';
  const alternateActionText =
    action === 'sign-up' ? 'Sign in instead' : 'Register now';
  const submitButtonText = action === 'sign-up' ? 'Register' : 'Log In';

  if (action === 'sign-up') {
    return (
      <form className="w-100" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">
            <input
              required
              autoFocus
              type="text"
              name="userName"
              className="form-control bg-light username-input"
              placeholder="Username"
            />
          </label>
        </div>
        <div className="mb-3">
          <label className="form-label">
            <input
              required
              type="password"
              name="password"
              className="form-control bg-light password-input"
              placeholder="Password"
            />
          </label>
        </div>
        <div className="mb-3">
          <label className="form-label">
            <input
              required
              autoFocus
              type="text"
              name="firstName"
              className="form-control bg-light"
              placeholder="First Name"
            />
          </label>
        </div>
        <div className="mb-3">
          <label className="form-label">
            <input
              required
              autoFocus
              type="text"
              name="lastName"
              className="form-control bg-light"
              placeholder="Last Name"
            />
          </label>
        </div>
        <div className="mb-3">
          <label className="form-label">
            <input
              required
              autoFocus
              type="text"
              name="phoneNumber"
              className="form-control bg-light"
              placeholder="Phone Number"
            />
          </label>
        </div>
        <div className="mb-3">
          <label className="form-label">
            <input
              required
              autoFocus
              type="text"
              name="email"
              className="form-control bg-light"
              placeholder="E-Mail"
            />
          </label>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <button type="submit" className="btn btn-primary register-submit">
            Register
          </button>
          <small>
            <div className="sign-in-line">
              <div className="have-account-line"> Already have an account?</div>
              <Link className="text-muted" to={alternateActionTo}>
                Sign in here!
              </Link>
            </div>
          </small>
        </div>
        {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
      </form>
    );
  }

  return (
    <form className="w-100" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">
          <input
            required
            autoFocus
            type="text"
            name="userName"
            className="form-control bg-light"
            placeholder="Username"
          />
        </label>
      </div>
      <div className="mb-3">
        <label className="form-label">
          <input
            required
            type="password"
            name="password"
            className="form-control bg-light"
            placeholder="Password"
          />
        </label>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <button type="submit" className="btn btn-primary sign-in-button">
          Sign In
        </button>
        <small>
          <div className="sign-up-line">
            <div className="dont-line">Don't have an account?</div>
            <Link className="text-muted" to={alternateActionTo}>
              Sign Up
            </Link>
          </div>
        </small>
      </div>
      {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
    </form>
  );
}
