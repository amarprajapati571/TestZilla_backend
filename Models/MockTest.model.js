import mongoose from "mongoose";

// Defining Schema
const MockTestSchema = new mongoose.Schema({
  ExamID: { type: String, required: true, trim: true },
  TestName: { type: String, required: true, trim: true },
  IsDeleted: { type: Boolean,default: false},
  IsLaunch: { type: Boolean,default: false},
  TotalQuestion:{type:Number},
  LaunchDate:{type:Date},
  LaunchDate:{type:Date},
  CreatedDate: {type: Date},
  LaunchDate: {type: Date},
  CreatedBy: {type: String},
  LastUpdatedBy: {type: String},
});

// Model
const MockTestModel = mongoose.model("MockTest", MockTestSchema);

export default MockTestModel;
