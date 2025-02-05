import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  registered_events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
});

const User = mongoose.model("User", userSchema);
export default User; 
