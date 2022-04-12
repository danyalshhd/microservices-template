import express from "express";
import "express-async-errors";
import { json } from "body-parser";
// import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError } from "@dstransaction/common";

import { sendSmsRouter } from "./routes/sms";
import { sendSmsParamsRouter } from "./routes/param-sms";
import { sendOTPRouter } from "./routes/otp";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
    name: "session",
  })
);

app.use(sendSmsRouter);
app.use(sendSmsParamsRouter);
app.use(sendOTPRouter);

app.all("*", async (req, res) => {
    throw new NotFoundError();
});
  
app.use(errorHandler);
  
const start = async () => {    
    app.listen(3000, () => {
        console.log("SMS - Listening on port 3000");
    });
};
  
start();