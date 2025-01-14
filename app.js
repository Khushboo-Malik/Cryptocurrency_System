require("dotenv").config();

const mongoose=require("mongoose");
const express = require("express");
const { connectMongoDb } = require("./connection");
const {createAlert}=require("./src/controllers/alertController");


const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/createAlert",createAlert);

app.listen(PORT, () => console.log(`Server Started at PORT ${PORT}!`));