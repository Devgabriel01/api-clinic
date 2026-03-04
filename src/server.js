require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

// Middlewares básicos
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rota de saúde
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "api-clinic" });
});

// Rotas da API
app.use("/api", require("./routes"));

// Middleware de erro (SEMPRE por último)
app.use(require("./middlewares/error.middleware"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API Clinic running on http://localhost:${port}`);
});