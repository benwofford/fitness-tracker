import mongoose from "mongoose";
const { Schema } = mongoose;

const exerciseSchema = new Schema({
  type: { type: String },
  name: String,
  duration: Number,
  weight: Number,
  reps: Number,
  sets: Number,
  distance: Number,
});

const workoutSchema = new Schema({
  day: { type: Date, default: Date.now },
  exercises: [exerciseSchema],
});

// {
//     day: new Date(new Date().setDate(new Date().getDate() - 9)),
//     exercises: [
//       {
//         type: 'resistance',
//         name: 'Bicep Curl',
//         duration: 20,
//         weight: 100,
//         reps: 10,
//         sets: 4,
//       },
//     ],
//   },
