const router = require('express').Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const { login, getInfo } = require('./AuthController')
module.exports = {
  /* *** GET ENDPOINTS *** */
  login: (req, res) => res.render('auth/login'),
  register: (req, res) => res.render('auth/register'),
  logout: (req, res) => {
    req.logout();
    res.redirect('/auth/login');
  },
  secret: (req, res) => {
    console.log('111111');
    res.render('auth/secret')
  },
  /* *** POST ENDPOINTS *** */
  postRegister: (req, res) => {
    console.log('22222', req.body.password);
    let errors = [];
    if (req.body.password != req.body.rpassword)
      errors.push({ text: 'Password do not match' });
    if (req.body.password.length < 4)
      errors.push({ text: 'Password must be at least 4 characters!' });
    // verify if errors exist
    if (errors.length > 0) {
      res.render('auth/register', {
        errors,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        rpassword: req.body.rpassword
      });
    } else {
      User.findOne({ email: req.body.email })
        .then(user => {
          if (user) {
            errors.push({ text: 'User already exist!' });
            res.render('auth/register', { errors, name: '', email: '', password: '', rpassword: '' });
          } else {
            const newUser = new User({
              name: req.body.name,
              email: req.body.email,
              password: req.body.password
            });
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                  .then(user => {
                    res.redirect('/auth/login');
                  })
                  .catch(err => console.log(err));
              });
            });
          }
        });
    }
  },
  postLogin: (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/auth/secret',
      failureRedirect: '/auth/login'
    })(req, res, next);
  },
  checkLogin: (req, ress, next) => {
    console.log('reqqqq', req.body);
    User.findOne({ email: req.body.email }).lean()
      .then(user => {
        if (user) {
          bcrypt.compare(req.body.password, user.password, async (err, res) => {
            if (res) {
              let response = await getInfo(req.body.email, user.password)
              return ress.status(200).json({ response })

            } else {
              return ress.status(401).json({
                message: 'UnAuth'
              })
              // Send JWT
            }
          });
          // return res.status(200).json({ user })
        } else {

        }
      });

  }// Finish
};
