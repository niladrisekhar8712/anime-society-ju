import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connect } from "mongoose";
import dotenv from "dotenv";
import passport from "passport";
import router from "./routes.js";
import "./passport.js"; 
dotenv.config({ path: "../.env" }); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Connection Error:", err));

app.use("/api", router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));