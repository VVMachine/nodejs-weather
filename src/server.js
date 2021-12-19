const express = require("express");
const Joi = require("joi");
const axios = require("axios").default;

const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

app.get("/weather", validateWeatherQueryParams, getWeather);

function validateWeatherQueryParams(req, res, next) {
  const weatherRules = Joi.object({
    lat: Joi.string().required(),
    lon: Joi.string().required(),
  });

  const valitationResult = weatherRules.validate(req.query);

  if (valitationResult.error) {
    res.status(400).send(valitationResult.error.message);
  }

  next();
}

async function getWeather(req, res, next) {
  const { lat, lon } = req.query;

  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${lat},${lon}`
    );

    const statusCode = await response.status;
    const responseData = await response.data;

    res.status(statusCode).send(responseData);
  } catch (error) {
    const { status, data } = error.response;

    res.status(status).send(data.error.message);
  }
}

app.listen(process.env.PORT, () => {
  console.log("Server started on", process.env.PORT);
});
