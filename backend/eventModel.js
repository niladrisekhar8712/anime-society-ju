import { Schema, model } from "mongoose";

const eventSchema = new Schema({
  event_id: { type: String, required: true, unique: true },
  event_name: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  pic_link: { type: String },
});

const Event = model("Event", eventSchema);
export default Event;
