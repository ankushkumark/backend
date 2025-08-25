import Goals from "../models/Goals.js";

// ✅ GET goals (user-specific)
export const getGoals = async (req, res) => {
  try {
    // fetching golas according to users
    const goal = await Goals.findOne({ email: req.user.email }).sort({ createdAt: -1 });

    if (!goal) {
      // 👈 if there is no goals for user by default 0
      return res.json({ target: 0, achieved: 0 });
    }

    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ POST and UPDATE goals (user-specific)
export const createGoal = async (req, res) => {
  try {
    const { target, achieved } = req.body;

    // if user goal exists then update, otherwise create new
    const goal = await Goals.findOneAndUpdate(
      { email: req.user.email },   // filter user-specific
      { 
        target, 
        achieved, 
        email: req.user.email       // 👈 ensure savig email
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
