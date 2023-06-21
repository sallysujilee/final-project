import 'dotenv/config';
import express from 'express';
import errorMiddleware from './lib/error-middleware.js';
import pg from 'pg';
import ClientError from './lib/client-error.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import bodyParser from 'body-parser';

// eslint-disable-next-line no-unused-vars -- Remove when used
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

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

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { userName, password, firstName, lastName, email, phoneNumber } =
      req.body;
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
    const [user] = result.rows;
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

app.post('/create-checkout-session/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const {
      service,
      description,
      references,
      email,
      firstName,
      lastName,
      companyName,
    } = req.body;

    let price;
    if (service === 'photography') {
      price = 24000;
    } else if (service === 'graphic-design') {
      price = 15000;
    } else {
      price = 40000;
    }
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: service,
              description: description,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      client_reference_id: userId,
      customer_email: email,
      metadata: {
        references: references,
        firstName: firstName,
        lastName: lastName,
        companyName: companyName,
        service: service,
        description: description,
        price: price,
      },
      mode: 'payment',
      success_url: 'http://localhost:3000/thankyouconfirm',
      cancel_url: 'http://localhost:3000/serviceformpage',
    });

    res.redirect(303, session.url);
  } catch (err) {
    next(err);
  }
});

app.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  async (req, res, next) => {
    const payload = req.body;

    if (payload.type === 'checkout.session.completed') {
      const firstName = payload.data.object.metadata.firstName;
      const lastName = payload.data.object.metadata.lastName;
      const companyName = payload.data.object.metadata.companyName;
      const email = payload.data.object.customer_email;
      const serviceType = payload.data.object.metadata.service;
      const description = payload.data.object.metadata.description;
      const references = payload.data.object.metadata.references;
      const price = payload.data.object.metadata.price;
      const userId = payload.data.object.client_reference_id;

      try {
        const sql = `
      insert into "orders" ("firstName", "lastName", "companyName", "email", "serviceType", "description", "references", "price", "userId")
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        returning "firstName", "lastName", "companyName", "email", "serviceType", "description", "references", "price"
    `;
        const params = [
          firstName,
          lastName,
          companyName,
          email,
          serviceType,
          description,
          references,
          price,
          userId,
        ];
        const result = await db.query(sql, params);
        const [user] = result.rows;
        res.status(201).json(user);
      } catch (err) {
        next(err);
      }
    } else {
      res.status(200).json(payload);
    }
  }
);

app.post('/api/orders/:id', async (req, res, next) => {
  console.log('correct endpoint hit');
  const { id } = req.params;
  console.log('id', id);
  try {
    const {
      firstName,
      lastName,
      companyName,
      email,
      serviceType,
      description,
      references,
      price,
    } = req.body.postRequestObject;
    console.log(
      firstName,
      lastName,
      companyName,
      email,
      serviceType,
      description,
      references,
      price
    );
    const sql = `
      insert into "orders" ("firstName", "lastName", "companyName", "email", "serviceType", "description", "references", "price", "userId")
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        returning "firstName", "lastName", "companyName", "email", "serviceType", "description", "references", "price"

    `;
    const params = [
      firstName,
      lastName,
      companyName,
      email,
      serviceType,
      description,
      references,
      price,
      id,
    ];
    const result = await db.query(sql, params);
    const [user] = result.rows;
    res.status(201).json(user);
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
