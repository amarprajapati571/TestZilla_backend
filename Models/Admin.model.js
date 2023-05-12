import mongoose from "mongoose";

// Defining Schema
const AdminSchema = new mongoose.Schema({
  Name: { type: String, required: true, trim: true },
  Email: { type: String, required: true, trim: true },
  Password: { type: String, required: true, trim: true },

  IsDeleted: {
    type: Boolean,
    default: false,
  },
  IsActive: {
    type: Boolean,
    default: true,
  },
  CreatedDate: {
    type: Date,
  },
  LastUpdatedDate: {
    type: Date,
  },
  CreatedBy: {
    type: String,
  },
  LastUpdatedBy: {
    type: String,
  },
});

// Model
const AdminModel = mongoose.model("Admin", AdminSchema);

export default AdminModel;
