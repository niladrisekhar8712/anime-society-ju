import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "./userModel.js";
import Event from "./eventModel.js";

const router = express.Router();

// Google OAuth Routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Generate a JWT token
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  }
);

router.get("/protected", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json({ message: "You are authenticated!", user });
  })(req, res, next);
});


/////////////////////////////////  EVENTS  //////////////////////////////////////////////////////////////////////////////////

// TO GET ALL EVENTS
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TO POST A NEW EVENT
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

// TO GET A SPECIFIC EVENT BY EVENT_ID
router.get("/events/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findOne({"event_id": eventId});
    if (!event) return res.status(404).json({ message: "Event not found" });

    const users = await User.find({ registered_events: eventId }).select("name email");
    res.json({ event, registered_users: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/////////////////////////////////  USERS  //////////////////////////////////////////////////////////////////////////////////

// TO GET ALL USERS
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().populate("registered_events");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TO GET DETAILS ABOUT A SPECIFIC USER
router.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const users = await User.findOne({user_id: userId});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TO POST A NEW USER
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

/////////////////////////////////  REGISTRATION  //////////////////////////////////////////////////////////////////////////////////

// TO REGISTER A NEW USER FOR AN EVENT
router.post("/users/:userId/register", async (req, res) => {
  try {
    const { userId } = req.params;
    const { event_ids } = req.body; 

    const user = await User.findOne({ user_id: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const existingEvents = await Event.find({ event_id: { $in: event_ids } });
    const validEventIds = existingEvents.map(event => event.event_id);
    const invalidEventIds = event_ids.filter(id => !validEventIds.includes(id));

    if (invalidEventIds.length > 0) {
      return res.status(400).json({ message: "Some events do not exist", invalidEventIds });
    }

    user.registered_events = [...new Set([...user.registered_events, ...validEventIds])];
    await user.save();

    res.json({ message: "User registered for events", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// TO UNREGISTER AN USER FROM AN EVENT
router.delete("/users/:userId/unregister/:eventId", async (req, res) => {
  try {
    const { userId, eventId } = req.params;

    const user = await User.findOne({ user_id: userId });
    if (!user) return res.status(404).json({ message: "User not found" });
    const event = await Event.findOne({event_id: eventId});
    if(!event) return res.status(404).json({ message: "Event not found" }); // event does not exist
    


    user.registered_events = user.registered_events.filter(id => id.toString() !== eventId);
    await user.save();

    res.json({ message: "User unregistered from event", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
