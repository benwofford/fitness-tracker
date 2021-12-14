const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
// const db = require("./models");

const PORT = process.env.PORT || 3000;

const Workout = require("./models/workout");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// API Routes

// GET most recent workout
app.get("/api/workouts", (req, res) => {
  Workout.aggregate([
    { $sort: { _id: -1 } },
    { $limit: 1 },
    { $addFields: { totalDuration: { $sum: "$exercises.duration" } } },
  ])
    .then((workouts) => {
      res.json(workouts);
    })
    .catch((err) => {
      res.json(err);
    });
});

// PUT a new exercise in a Workout document's array
app.put("/api/workouts/:id", (req, res) => {
  let newExercise = req.body;
  Workout.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { exercises: newExercise } }
  )
    .then((requestedWorkout) => {
      res.json(requestedWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});

// POST new workout
app.post("/api/workouts", (req, res) => {
  Workout.create({
    day: new Date(new Date().setDate(new Date().getDate() - 9)),
    exercises: req.data,
  })
    .then((newWorkout) => {
      res.json(newWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});

// GET all workouts
app.get("/api/workouts/range", (req, res) => {
  Workout.aggregate([
    { $match: { _id: { $exists: true } } },
    { $addFields: { totalDuration: { $sum: "$exercises.duration" } } },
  ])
    .then((allWorkouts) => {
      res.json(allWorkouts);
    })
    .catch((err) => {
      res.json(err);
    });
});

// HTML Routes
app.get("/exercise?id=:id", (req, res) => {
  res.sendFile(path.join(__dirname, "public/exercise.html"));
});

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname, "public/exercise.html"));
});

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, "public/stats.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
