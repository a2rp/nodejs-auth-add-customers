const router = require("express").Router();
const {
    register,
    login,
    logout,
    isLoggedIn
} = require("../controllers/user.controllers");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/isLoggedIn", isLoggedIn);

module.exports = router;

