const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

function generateRandomIntInRange(a, b) {
  return a + Math.floor(b * Math.random());
}

function countQuestions() {
  let count = undefined;
  const db = new sqlite3.Database("./database.db");

  db.serialize(() => {
    db.get(`SELECT COUNT(*) AS count FROM "Question"`, (err, row) => {
      count = row.count;
    });
  });

  db.close();
  return count;
}

function countAnswers() {
  let count = undefined;
  const db = new sqlite3.Database("./database.db");

  db.serialize(() => {
    db.get(`SELECT COUNT(*) AS count FROM "Answer"`, (err, row) => {
      count = row.count;
    });
  });

  db.close();
  return count;
}

app.get("/api/getQuestionAndAnswers", (req, res) => {
  const questionId = generateRandomIntInRange(1, countQuestions());

  const db = new sqlite3.Database("./database.db");
  let payload = {
    question: undefined,
    answers: [],
  };

  db.serialize(() => {
    db.get(`SELECT id, difficulty, content FROM "Question" WHERE id=${questionId}`, (err, row) => {
      const question = {
        id: row.id,
        difficulty: row.difficulty,
        content: row.content,
      }

      payload.question = question;
    });

    db.each(`SELECT id, questionId, content, isCorrect FROM "Answer" WHERE questionId=${questionId}`, (err, row) => {
      const answer = {
        id: row.id,
        questionId: row.questionId,
        content: row.content,
        isCorrect: row.isCorrect,
      }

      payload.answers.push(answer);
    });

    res.send(payload);
  });

  db.close();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
