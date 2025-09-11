import express from "express";
import cors from "cors";
import "dotenv/config";
import summaryRoutes from "./routes/summaryRoutes.js";
import path from "path";
const app = express();
const port = process.env.PORT || 3030;
const __dirname = path.resolve();

// middleware
if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: "http://localhost:5173/" }));
}

app.use(express.json());

//api route
app.use("/api", summaryRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

//for Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(port, () => {
  console.log(`Server is listening on PORT ${port}`);
});
