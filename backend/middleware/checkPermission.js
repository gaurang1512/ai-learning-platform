export const checkPermission = () => {
  return async (req, res, next) => {
    return next();
  };
};
