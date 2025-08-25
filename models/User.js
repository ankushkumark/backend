import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // 
  googleId: { type: String }, // ✅ for Google 
  phone: { type: String }, // ✅ phone number add
  profilePic: { type: String }, // ✅ profile pic path add
});

const User = mongoose.model("User", userSchema);
export default User;
