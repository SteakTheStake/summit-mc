import express from "express";
import payload from "payload";

import cors from "cors";
var corsOptions = {
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
};

require("dotenv").config();
const app = express();
app.use(cors(corsOptions));

// Redirect root to Admin panel
app.get("/", (_, res) => {
  res.redirect("/admin");
});

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  // Add your own express routes here

  app.listen(process.env.PORT || 3001);
};

start();
