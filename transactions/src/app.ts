import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@dstransaction/common";
import { createTransactionRouter } from "./routes/new";
import { showTransactionRouter } from "./routes/show";
import { indexTransactionRouter } from "./routes/index";
import { updateTransactionRouter } from "./routes/update";

import { prometheusRouter } from "./routes/prometheus";

// const i18n = require("i18n");

const app = express();

// i18n.configure({
//   // locales: ["en", "fr"],
//   defaultLocale: "en",
//   autoReload: true,
//   directory: __dirname + "/locales",
// });

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

// middleware for localization
// app.use((req, res, next) => {
//   i18n.setLocale(req.headers["accept-language"]);
//   next();
// });

app.use(currentUser);

app.use(createTransactionRouter);
app.use(showTransactionRouter);
app.use(indexTransactionRouter);
app.use(updateTransactionRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
