

const authenticate = (req, res, next) => {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  //if (token !== "dev-token") return res.status(401).json({ msg: "Unauthorized. Use Bearer dev-token" });
  req.user = { id: 1, email: "dev@sheetpilot.local", role: "admin" };
  next();
};
export default authenticate;
