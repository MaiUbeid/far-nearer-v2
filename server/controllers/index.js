const router = require('express').Router();

const { auth } = require('./middleware/auth');

const {
  getEmptyBuildings,
  postEmptyBuilding,
  getBuilding,
} = require('./emptyBuildings');
const mailList = require('./mailList');
const { signIn } = require('./users');

router.post('/sign-in', signIn);

router.get('/mailList', mailList);
router.post('/report-building', postEmptyBuilding);

// router.use(auth);
router.get('/empty-buildings', getEmptyBuildings);
router.get('/empty-buildings/:id', getBuilding);

module.exports = router;
