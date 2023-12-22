const router = require('express').Router();

const userController = require('../controllers/user');
const { ensureGuest, ensureAuthenticated } = require('../libs/auth');

/* *** GET ENDPOINTS *** */
router.get('', (req, res, next) => {
  return res.status(200).json({
    DA: "xin chào"
  })
})
router.get('/login', ensureGuest, userController.login);
router.get('/register', ensureGuest, userController.register);
router.get('/logout', ensureAuthenticated, userController.logout);
router.get('/secret', ensureGuest, userController.secret);
/* *** POST ENDPOINTS *** */
router.post('/register', userController.postRegister);
router.post('/login', userController.checkLogin);
// finish -> export
module.exports = router;
