import express from "express";
import User from "./userModel.js"; 
import Event from "./eventModel.js"; 

const router = express.Router();

router.post("/events", async (req, res) => {
  try {
    const { event_id, event_name, description, date, pic_link } = req.body;
    const event = new Event({ event_id, event_name, description, date, pic_link });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/events/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const users = await User.find({ registered_events: eventId }).select("name email");
    res.json({ event, registered_users: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/users", async (req, res) => {
  try {
    const { user_id, name, email } = req.body;
    const user = new User({ user_id, name, email, registered_events: [] });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get("/users", async (req, res) => {
  try {
    const users = await User.find().populate("registered_events");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/users/:userId/register", async (req, res) => {
  try {
    const { userId } = req.params;
    const { eventIds } = req.body; 

    const user = await User.findOne({ user_id: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate event IDs
    const events = await Event.find({ _id: { $in: eventIds } });
    if (events.length !== eventIds.length) {
      return res.status(400).json({ message: "Some events do not exist" });
    }

    // Register user for events (avoid duplicates)
    user.registered_events = [...new Set([...user.registered_events, ...eventIds])];
    await user.save();

    res.json({ message: "User registered for events", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/users/:userId/unregister/:eventId", async (req, res) => {
  try {
    const { userId, eventId } = req.params;

    const user = await User.findOne({ user_id: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.registered_events = user.registered_events.filter(id => id.toString() !== eventId);
    await user.save();

    res.json({ message: "User unregistered from event", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;