import express from "express";
import { MongoClient } from "mongodb";
import "dotenv/config";

const app = express();

export async function connectToDatabase() {
  const mongoClient = new MongoClient(process.env.DB_CONNECTION_STRING);
  await mongoClient.connect();

  console.log(`Database connected`);
  return mongoClient.db(process.env.DB_NAME || "smidig");
}

const description = {
  endpoints: [
    {
      quiz: "GET. Returns all questions",
      user: "POST. Adds user(register)",
      login:
        "POST. Returns 200 if username/password is correct, else returns 401",
    },
  ],
};

const quizData = {
  results: [
    {
      Id: 1,
      question: "Hva er et kvernfall?",
      wrong_answer: [
        "Et fall som har blitt kvernet",
        "En kvern som faller",
        "En foss som har et kvernetfall",
      ],
      correct_answer: ["Et fossefall som er stort nok til å drive kvern"],
      image_url: "",
      points: 0,
    },
    {
      Id: 3,
      question: "Hva er et kvernfall?",
      wrong_answer: [
        "Et fall som har blitt kvernet",
        "En kvern som faller",
        "En foss som har et kvernetfall",
      ],
      correct_answer: ["Et fossefall som er stort nok til å drive kvern"],
      image_url: "",
      points: 0,
    },
    {
      Id: 2,
      question: "Hva er et kvernfall?",
      wrong_answer: [
        "Et fall som har blitt kvernet",
        "En kvern som faller",
        "En foss som har et kvernetfall",
      ],
      correct_answer: ["Et fossefall som er stort nok til å drive kvern"],
      image_url: "",
      points: 0,
    },
  ],
};

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
const dbConn = connectToDatabase();

app.set("db", dbConn);

app.get("/", (req, res) => {
  res.json(description);
});

app.get("/quiz", (req, res) => {
  res.json(quizData);
});

app.post("/user", async (req, res) => {
  const { username, password } = req.body;

  /*dataUsers.push({username, password})*/
  const connection = await req.app.get("db");
  connection.collection("user").insertOne({ username, password });

  res.sendStatus(201);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const connection = await req.app.get("db");
  const users = await getUsers(connection);
  console.log();

  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username) {
      if (users[i].password === password) {
        return res.sendStatus(200);
      }
    }
  }
  res.sendStatus(401);
});

async function getUsers(connection) {
  return await connection.collection("user").find().toArray();
}

app.get("/users", async (req, res) => {
  const connection = await req.app.get("db");
  const result = await getUsers(connection);
  res.json(result);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
