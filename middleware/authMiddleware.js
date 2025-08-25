import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  // Token in Header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // "Bearer xyz" format ko handling
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    // JWT verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ from here email and name coming
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name, // 👈 important
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
export default authMiddleware;