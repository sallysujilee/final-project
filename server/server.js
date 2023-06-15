import 'dotenv/config';
import express from 'express';
import errorMiddleware from './lib/error-middleware.js';
import pg from 'pg';
import ClientError from './lib/client-error.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

// eslint-disable-next-line no-unused-vars -- Remove when used
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/build', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    //   console.log("req.body", req.body)
    const { userName, password, firstName, lastName, email, phoneNumber } =
      req.body;
    // console.log(userName, password, firstName, lastName, email, phoneNumber)
    if (
      !userName ||
      !password ||
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber
    ) {
      throw new ClientError(400, 'All fields are required');
    }
    const hashedPassword = await argon2.hash(password);
    console.log(hashedPassword);
    const sql = `
      insert into "users" ("firstName", "lastName", "email", "phoneNumber", "userName", "hashedPassword")
        values ($1, $2, $3, $4, $5, $6)
        returning "userId", "firstName", "lastName", "email", "phoneNumber", "userName", "hashedPassword"
    `;
    const params = [
      firstName,
      lastName,
      email,
      phoneNumber,
      userName,
      hashedPassword,
    ];
    const result = await db.query(sql, params);
    // console.log(result)
    const [user] = result.rows;
    // console.log(user)
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    console.log('req.body', req.body);
    const { userName, password } = req.body;
    console.log(userName);
    if (!userName || !password) {
      throw new ClientError(401, 'invalid login');
    }
    const sql = `
      select "userId",
          "hashedPassword"
        from "users"
      where "userName" = $1
    `;
    const params = [userName];
    const result = await db.query(sql, params);
    const [user] = result.rows;

    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const { userId, hashedPassword } = user;
    if (!(await argon2.verify(hashedPassword, password))) {
      throw new ClientError(401, 'invalid login');
    }
    const payload = { userId, userName };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET);
    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

/**
 * Serves React's index.html if no api route matches.
 *
 * Implementation note:
 * When the final project is deployed, this Express server becomes responsible
 * for serving the React files. (In development, the Create React App server does this.)
 * When navigating in the client, if the user refreshes the page, the browser will send
 * the URL to this Express server instead of to React Router.
 * Catching everything that doesn't match a route and serving index.html allows
 * React Router to manage the routing.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
