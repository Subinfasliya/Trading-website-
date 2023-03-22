var express = require('express');
const { response } = require('../app');
var personsHelpers = require('../helpers/persons-details');
var objectId = require('mongodb').ObjectId
var userHelpers = require('../helpers/user-helpers');
const videoHelpers = require('../helpers/video-helpers');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {


  res.render('index', { user: true, login: true });
});
router.get('/view-course', (req, res) => {

  res.render('user/view-course', { user: true, login: true })
})
router.get('/register/:id', (req, res) => {
  let courseDetails = req.params.id

  res.render('user/register', { courseSelection: courseDetails, user: true })
})
router.post('/submit', (req, res) => {
  console.log(req.body);

  personsHelpers.addPerson(req.body).then((data) => {
    res.render('user/success-register', { user: true })
  })
})

router.get('/login', (req, res) => {

  res.render('user/login', { user: true, "userloginErr": req.session.userloginErr })
  req.session.userloginErr = false
})
router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.active) {
      req.session.loggedIn = true
      req.session.person = response.person
      let person = req.session.person
      console.log(person);
      videoHelpers.getAllVideos().then((videos) => {
        res.render('user/video', { user: true, person, videos })
      })

    } else {
      req.session.userloginErr = "Invalid Email or Password"
      res.redirect('/login')
    }
  })

})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/login')
})

module.exports = router;
