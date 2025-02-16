const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

const db = new sqlite3.Database("./database.db");

app.get("/api", (req, res) => {
  db.serialize(() => {
    db.get(`SELECT COUNT(*) AS count FROM "Question"`, (err, row) => {
      const numberOfQuestions = row.count;
      const questionId = 1 + Math.floor(numberOfQuestions * Math.random());

      db.get(`SELECT difficulty, content FROM "Question" WHERE id = ?`, [questionId], (err, row) => {
        const question = {
          difficulty: row.difficulty,
          content: row.content,
        };

        db.all(`SELECT content, isCorrect FROM "Answer" WHERE questionId = ?`, [questionId], (err, rows) =>{
          const payload = {
            question: question,
            answers: rows,
          };

          res.json(payload);
        });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`PORT: ${PORT}`);
});
