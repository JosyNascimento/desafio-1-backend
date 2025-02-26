const passport = require('passport');

const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      console.log("Erro:", err, "Info:", info?.message || info?.toString());

      if (info?.message === "No auth token") {
        return res.redirect("/");
      }
      if (err) return next(err);
      if (!user) {
        return res.status(401).send({ error: info?.message || "Unauthorized" });
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};

module.exports = passportCall;
