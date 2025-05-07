import express from "express";
import router from "./routes/api";

const app = express();
const PORT = 3000;

app.use("/api", router);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`This website running on http://localhost:${PORT}`);
});
