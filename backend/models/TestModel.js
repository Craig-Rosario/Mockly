import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  createdAt: { type: Date, default: Date.now }
});

const TestModel = mongoose.model("Test", testSchema);

export default TestModel;
