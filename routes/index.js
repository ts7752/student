const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

//로그인 후 페이지

router.get("/", (req, res) => res.render("welcome"));

router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard", {
    name: req.user.name,
  })
);
module.exports = router;
