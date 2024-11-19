import express, { Request, Response } from "express";
import { getRecommendationsFromApi } from "./chatgtp_api_handler";

const app = express();

// GET movie based on title
app.get("/rec", (req: Request, res: Response) => {
  const title = req.query.title as string;
  const year = req.query.year as string;
  console.log(title);
  console.log(year);
  getRecommendationsFromApi(title, year)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(501);
    });
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("OK");
});

app.listen();
