require("dotenv").config();

const mongoose=require("mongoose");
const express = require("express");
const { connectMongoDb } = require("./connection");


const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


connectMongoDb(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected!"));

app.listen(PORT, () => console.log(`Server Started at PORT ${PORT}!`));