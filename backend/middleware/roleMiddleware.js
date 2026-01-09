//D:\E Commerce Website\backend\middleware\roleMiddleware.js
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Prefer token role if present, otherwise use DB user role
    const roleToCheck = req.tokenRole || req.user?.role;
    if (!roleToCheck || !roles.includes(roleToCheck)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient role" });
    }
    next();
  };
};
