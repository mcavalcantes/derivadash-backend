const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

const db = new sqlite3.Database("./database.db");

app.listen(PORT, () => {
  console.log(`PORT: ${PORT}`);
});
