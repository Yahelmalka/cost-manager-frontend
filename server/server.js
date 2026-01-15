// NOTE: This is the backend server code for the exchange rates API
// It is deployed on Render at: https://cost-manager-frontend-tfco.onrender.com/rates
// The frontend uses fetch() to call this deployed URL
// This file is only needed if you want to run the server locally or update it
// The frontend will work fine without this file as long as the server is deployed

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
