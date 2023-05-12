import mongoose from "mongoose";

// Defining Schema
const QuestionSchema = new mongoose.Schema({
  SubjectID: { type: String, required: true,},
  ExamID: { type: String, required: true,},
  TestID: { type: String, required: true,},
  Question:{type:String,trim:true},
  ImageQuestion:{type:String},
  Options:{type: [String],required:true},
  Description:{type:String,trim:true},
  CorrectAnswer:{type:String,required:true,trim:true},
  OldExam:{type:String,trim:true},
  IsDeleted: { type: Boolean,default: false},
  CreatedDate: {type: Date},
  CreatedBy: {type: String},
  LastUpdatedBy: {type: String},
  LastUpdatedDate:{type:Date}
});

// Model
const QuestionModel = mongoose.model("Question", QuestionSchema);

export default QuestionModel;
