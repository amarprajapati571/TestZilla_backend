import mongoose from "mongoose";

// Defining Schema
const ExamSchema = new mongoose.Schema({
  ExamName: { type: String, required: true, trim: true },
  MinusMarking: { type: Number, required: true, trim: true },
  QuestionMarking: { type: Number, required: true, trim: true },
  IsDeleted: { type: Boolean,default: false},
  IsLive: {type: Boolean,default: false},
  CreatedDate: {type: Date},
  LaunchDate: {type: Date},
  LastUpdatedDate: {type: Date},
  CreatedBy: {type: String},
  LastUpdatedBy: {type: String},
});

// Model
const ExamModel = mongoose.model("Exam", ExamSchema);

export default ExamModel;
