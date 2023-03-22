var express = require('express');
const { response } = require('../app');
const { getActivePersons } = require('../helpers/persons-details');
var router = express.Router();
var personsHelpers = require('../helpers/persons-details');
var videoHelpers = require('../helpers/video-helpers');
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/admin/admin-login')
  }
}
/* GET users listing. */
router.get('/', function (req, res, next) {
  // if direct get persons view page

  // personsHelpers.getAllPersons().then((persons)=>{
  //   console.log(persons);

  res.redirect('/admin/admin-home');
})
// });
router.get('/admin-home', verifyLogin, (req, res) => {
  res.render('admin/admin-home')
})
router.get('/admin-register', (req, res) => {
  res.render('admin/admin-register')

})
router.get('/admin-login', (req, res) => {

  res.render('admin/admin-login', { "loginErr": req.session.loginErr })
  req.session.loginErr = false
})

router.post('/admin-register', (req, res) => {
  personsHelpers.adminSignup(req.body).then((response) => {
    console.log(response)
    res.redirect('/admin/admin-register')
  })

})
router.post('/admin-login', (req, res) => {
  personsHelpers.adminLogin(req.body).then((response) => {
    if (response.adminstatus) {
      req.session.loggedIn = true
      req.session.admin = response.admin
      let admin = req.session.admin
      console.log(admin);
      res.render('admin/admin-home', { admin })

    } else {
      req.session.loginErr = "Invalid Email or Password"
      res.redirect('/admin/admin-login')
    }
  })
})
router.get('/admin-logout', (req, res) => {
  req.session.destroy()
  res.redirect('/admin/admin-login')
})
router.get('/view-persons', verifyLogin, (req, res) => {

  personsHelpers.getAllPersons().then((persons) => {

    res.render('admin/view-persons', { persons, admin: req.session.admin })
  })

})


router.get('/delete-persons/:id', (req, res) => {
  let personId = req.params.id

  personsHelpers.deletePerson(personId).then((resopnse) => {

    res.redirect('/admin/view-persons')
  })

})



router.get('/active', verifyLogin, async (req, res) => {

  personsHelpers.getActivePersons().then((ActivePersons) => {


    res.render('admin/active', { ActivePersons, admin: req.session.admin });
  });



})

router.get('/active-persons/:id', (req, res) => {

  personsHelpers.activePerson(req.params.id).then(() => {

    res.json({ status: true })

  })

})
router.get('/delete-activepersons/:id', (req, res) => {
  console.log(req.params.id)
  personsHelpers.deleteActivePersons(req.params.id).then((response) => {
    res.redirect('/admin/active')
  })
})
router.get('/admin-videos', verifyLogin, (req, res) => {
  videoHelpers.getAllVideos().then((videos) => {
    res.render('admin/admin-videos', { videos, admin: req.session.admin })
  })

})


router.get('/add-videos', verifyLogin, (req, res) => {
  res.render('admin/add-videos', { admin: req.session.admin })
})
router.post('/add-videos', (req, res) => {
  console.log(req.body)
  console.log(req.files.Video)

  videoHelpers.addVideos(req.body, (id) => {

    let video = req.files.Video
    console.log(id);
    video.mv('./public/course-videos/' + id + '.mp4', (err, done) => {

      if (!err) {

        res.redirect('/admin/add-videos')
      } else {
        console.log(err);
      }
    })
  })

})
router.get('/delete-video/:id', (req, res) => {
  console.log(req.params.id);
  videoHelpers.deleteVideo(req.params.id).then((data) => {
    res.redirect('/admin/admin-videos')
  })

})





module.exports = router;
