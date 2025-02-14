const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

app.get("/api", (req, res) => {
  res.send("hello, world!");
});

app.get("/api/countQuestions", (req, res) => {
  const db = new sqlite3.Database("./database.db");

  db.serialize(() => {
    db.get(`SELECT COUNT(*) AS count FROM "Question"`, (err, row) => {
      res.send({ count: row.count });
    });
  });

  db.close();
});

app.get("/api/countAnswers", (req, res) => {
  const db = new sqlite3.Database("./database.db");

  db.serialize(() => {
    db.get(`SELECT COUNT(*) AS count FROM "Answer"`, (err, row) => {
      res.send({ count: row.count });
    });
  });

  db.close();
});



app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
