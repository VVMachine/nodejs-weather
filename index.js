const express = require("express");
const Joi = require("joi");
const dotenv = require('dotenv')

dotenv.config();

const app = express();


console.log(process.env);

app.use(express.json());

app.get("/hello", (req, res, next) => {
  console.log("request body", req.body);
  res.send("hello world");
});

app.get(
  "/weather",

  (req, res, next) => {
    const weatherRules = Joi.object({
      lat: Joi.string().required(),
      lon: Joi.string().required(),
    });

    const valitationResult = weatherRules.validate(req.query);

    if (valitationResult.error) {
      res.status(400).send(valitationResult.error.message);
    }

    next();
  },

  (req, res, next) => {
    console.log(req.query);
    res.json({
      weather: "test",
    });
  }
);

app.listen(process.env.PORT, () => {
  console.log("Server started on", process.env.PORT);
});
