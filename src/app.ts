import cors from "cors";
import express, { Application } from "express";
import bodyParser from "body-parser";
import router from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorhandler";
import { notFoundRoute } from "./app/middlewares/notFound";

const app: Application = express();

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(
  express.urlencoded({ limit: "25mb", extended: true, parameterLimit: 50000 })
);

app.use(bodyParser.text({ limit: "200mb" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", router);

app.use(globalErrorHandler);
app.use(notFoundRoute);

export default app;
