export const isRole = (allowed) => {
  const allowedSet = Array.isArray(allowed)
    ? new Set(allowed)
    : new Set([allowed]);
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) {
      return res.status(401).json({ message: "Unauthorized: Missing role" });
    }
    if (!allowedSet.has(role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }
    next();
  };
};
