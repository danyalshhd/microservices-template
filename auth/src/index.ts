import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { prometheusRouter } from "./routes/prometheus";
import { errorHandler, NotFoundError } from "@dstransaction/common";

const i18n = require("i18n");

const app = express();

i18n.configure({
  // locales: ["en", "fr"],
  defaultLocale: "en",
  autoReload: true,
  directory: __dirname + "/locales",
});

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
    name: "session",
  })
);

// Prom-Client middleware should be at top to detect routes
// All other routes/middlewares will go after this
app.use(prometheusRouter);

// app.use(i18n.init); // => this is not working

// own middleware setup
app.use((req, res, next) => {
  i18n.setLocale(req.headers["accept-language"]);
  next();
});

// app.use((req, res, next) => {
//   console.log("333333333")
//   console.log(req.session);
//   console.log("333333333")
// })

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};

start();
