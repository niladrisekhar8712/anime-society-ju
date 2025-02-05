import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connect } from "mongoose";
import router from "./routes.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connect("mongodb://localhost:27017/animeSociety", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Connection Error:", err));

app.use("/api", router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
