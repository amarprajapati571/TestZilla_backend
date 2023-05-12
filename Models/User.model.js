import mongoose from "mongoose";

// Defining Schema
const UserSchema = new mongoose.Schema({
  Name: { type: String, required: true, trim: true },
  Email: { type: String, required: true, trim: true },
  Password: { type: String, required: true, trim: true },
  ProfileImagae:{type:String,default:null},
  PhoneNumber:{type:String,default:null},
  Code:{type:String,default:null},
  Token:{type:String,default:""},
  IsDeleted: { type: Boolean,default: false},
  IsActive: {type: Boolean,default: true},
  CreatedDate: {type: Date},
  LastUpdatedDate: {type: Date},
  CreatedBy: {type: String},
  LastUpdatedBy: {type: String},
});

// Model
const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
