import express from "express";
import logger from "../logger/logger";

const router = express.Router();
const i18n = require("i18n");

router.post("/api/users/signout", (req, res) => {
  req.session = null;

  logger.info("User Signout!");
  logger.error("Testing!");

  res.send(i18n.__("user_signout_success"));
  // res.send({});
});

export { router as signoutRouter };
