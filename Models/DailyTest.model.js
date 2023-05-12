import mongoose from "mongoose";

// Defining Schema
const DailyTestSchema = new mongoose.Schema({
  SubjectID: { type: String, required: true, trim: true },
  ExamID: { type: String, required: true, trim: true },
  TestName: { type: String, required: true, trim: true },
  IsDeleted: { type: Boolean,default: false},
  IsLaunch: { type: Boolean,default: false},
  TotalQuestion:{type:Number},
  LaunchDate:{type:Date},
  LaunchTime:{type:Date},
  CreatedDate: {type: Date},
  LastUpdatedDate: {type: Date},
  CreatedBy: {type: String},
  LastUpdatedBy: {type: String},
});

// Model
const DailyTestModel = mongoose.model("DailyTest", DailyTestSchema);

export default DailyTestModel;
