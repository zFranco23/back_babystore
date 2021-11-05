const { Router } = require('express');

const { validateToken } = require('../middlewares/validateToken');

const { updateProfileImage } = require('../controllers/uploads.controller');

const router = Router();



router
    .post('/supplier/avatar', [
        validateToken
    ] ,updateProfileImage );
    
module.exports = router;