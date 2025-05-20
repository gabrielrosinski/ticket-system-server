import express, { Application, Request, Response, NextFunction } from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";

import config from "./config/config.js";
import db from "./database/connect.js";

import { router } from "./routes/index.js";
import { HttpError } from "./errors/index.js";

const PORT = config.port || 8080;

const app: Application = express();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.use(express.json());

app.use(express.urlencoded({extended: false}));

app.use(cookieParser());

app.use(logger("dev"));

// caching 
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  next();
});

app.use("/api", router);

app.get("/", async (req: Request, res: Response) => {
  try {
    const result = await db.query("SELECT NOW()");
    console.log(result.rows);
    res.json({ message: "API is working!", time: result.rows[0] });
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
});

app.use("/", () => {
  throw new HttpError(404, "Invalid endpoint");
});

/*
// an example how to catch error in async routes
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

app.get('/async-error', catchAsync(async (req, res, next) => {
  throw new AppError('Async Error', 500);
}));
*/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, _req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});

export default app;
