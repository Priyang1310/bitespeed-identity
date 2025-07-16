const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const identifyRoute = require("./routes/identifyRoute");

app.use(express.json());
app.use("/", identifyRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
