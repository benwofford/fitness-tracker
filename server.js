const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false,
});

// HTML Routes
app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/exercise.html"));
});

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/stats.html"));
});

app.get("/api/workouts", (req, res) => {
  db.Workout.aggregate({}).then((workouts) => {
    res.json(workouts);
  });
});

app.put("/api/workouts", (req, res) => {
  db.Workout.create({}).then((workouts) => {
    res.json(workouts);
  });
});

app.post("/api/workouts", (req, res) => {});

app.get("/api/workouts/range", (req, res) => {
  db.Workout.aggregate({}).then((workouts) => {
    res.json(workouts);
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
