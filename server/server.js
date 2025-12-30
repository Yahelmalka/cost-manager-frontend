const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));

app.get("/rates", (req, res) => {
  res.json({ USD: 1, GBP: 0.6, EURO: 0.7, ILS: 3.4 });
});

app.get("/", (req, res) => {
  res.send("Exchange Rates API running. Use GET /rates");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
