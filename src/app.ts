import express from "express";
import router from "./routes/api";
import { db } from "./utils/database";
import cors from "cors";
import docs from "./docs/routes";

const app = express();
const PORT = 3000;

const startServer = async () => {
  try {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use("/api", router);
    docs(app);
    await db();
    app.listen(PORT, () => {
      console.log(`This website running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("error connect to api", error);
  }
};

startServer();
