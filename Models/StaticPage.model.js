import mongoose from "mongoose";

// Defining Schema
const StatePageSchema = new mongoose.Schema({
  Body: { type: String },
  Type: { type: String,trim: true },
  CreatedDate:{type:Date},
  LastUpdatedDate:{type:Date}
})

// Model
const StaticPageModel = mongoose.model("StaticPage", StatePageSchema)

export default StaticPageModel;