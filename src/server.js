require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "api-clinic" });
});

app.use("/api", require("./routes"));

app.use(require("./middlewares/error.middleware"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`API Clinic running on http://localhost:${port}`);
});