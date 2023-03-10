const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

//User Model
const User = require("../models/User");
const { route } = require(".");

//로그인
router.get("/login", (req, res) => res.render("Login"));
//회원가입
router.get("/register", (req, res) => res.render("Register"));

//Register Handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "모든 정보를 입력 했는지 확인해 주세요" });
  }

  //패스워드가 일치하는지 확인
  if (password !== password2) {
    errors.push({
      msg: "비밀번호가 일치하지 않습니다 다시 한번 확인해 주세요",
    });
  }

  //패스워드 길이 체크
  if (password.length < 8) {
    errors.push({ msg: "패스워드는 8자 이상 입니다." });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    //pass
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email is already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        // 비밀번호 해쉬암호화
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;
            //데이터베이스 저장
            newUser
              .save()
              .then((user) => {
                req.flash("success_msg", "회원가입 성공! 이제 로그인하세요");
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          })
        );

        // 데이터베이스 회원가입 유저 저장
      }
    });
  } // 풀 리퀘스트 테스트 2일차.
  //병합 확인 1일차 테스트
}),
  //로그인
  router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/users/login",
      failureFlash: true,
    })(req, res, next);
  });

//로그아웃
router.get("/logout", (req, res) => {
  req.logout(req.user, (err) => {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "로그아웃");
    res.redirect("/users/login");
  });
});
module.exports = router;
