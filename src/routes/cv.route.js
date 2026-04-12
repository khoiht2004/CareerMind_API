const router = require('express').Router();
const controller = require('@/controllers/cv.controller');
const { authRequired, roleRequired } = require('@/middlewares');
const uploadCV = require('@/middlewares/uploadCV');
const handleMulterError = require('@/middlewares/handleMulterError');

router.use(authRequired);

router.post(
  '/',
  roleRequired('CANDIDATE'),
  uploadCV.single('cv'),
  handleMulterError,
  controller.uploadCv,
);
router.get('/', roleRequired('CANDIDATE'), controller.getMyCvs);
router.delete('/:id', roleRequired('CANDIDATE'), controller.deleteCv);
router.post('/:id/default', roleRequired('CANDIDATE'), controller.setDefault);

// Authenticated users (recruiter/admin can view candidate CVs via application)
router.get('/:id', controller.getCvById);

module.exports = router;
