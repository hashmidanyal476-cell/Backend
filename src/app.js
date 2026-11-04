import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true,
  })
);

app.use(express.json({ limit: "16kb" })); //use to get json requests upto a limit
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // use to decode the url upcoming
app.use(express.static("public"));
app.use(cookieParser());

export default app();
