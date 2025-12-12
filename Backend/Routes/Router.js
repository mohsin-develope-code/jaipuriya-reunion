
const express = require("express");
const { handleGetUser, handleAdminLogin, handleGetUserPass, handleAdminLogout } = require("../Controller/AdminController");
const checkAuth = require("../Middleware/checkAuth");

const router = express.Router();



router.get('/admin/all-user', checkAuth , handleGetUser)

router.post('/login', handleAdminLogin )

router.get('/logout', handleAdminLogout)

router.post('/pass', handleGetUserPass);




module.exports = router;