import express from "express";
import cors from "cors";
import "dotenv/config";
import summaryRoutes from "./routes/summaryRoutes.js";
import path from "path";
const app = express();
const port = process.env.PORT || 3030;
const __dirname = path.resolve();

// middleware
app.use(cors());
app.use(express.json());

//api route
app.use("/api", summaryRoutes);
app.use(express.static(path.join(__dirname)));

//for Error handling

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(port, () => {
  console.log(`Server is listening on PORT ${port}`);
});
