import mongoose from "mongoose";

// Defining Schema
const SubjectSchema = new mongoose.Schema({
  SubjectName: { type: String, required: true, trim: true },
  ExamID: { type: String, required: true, trim: true },
  IsDeleted: { type: Boolean,default: false},
  CreatedDate: {type: Date},
  LaunchDate: {type: Date},
  CreatedBy: {type: String},
  LastUpdatedBy: {type: String},
});

// Model
const SubjectModel = mongoose.model("Subject", SubjectSchema);

export default SubjectModel;
