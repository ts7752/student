const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcryt = require("bcryptjs");

// User 경로 지정
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // 동일한 유저 찾음
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: "등록되어 있지 않은 이메일 입니다 회원가입 후 진행해 주세요.",
            });
          }

          //비밀번호 매칭, 해쉬암호 복호화
          bcryt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {
                message: "비밀번호를 다시 확인해 주세요.",
              });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );
  //Passport 직렬화
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
