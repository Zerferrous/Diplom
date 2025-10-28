const Router = require("express");
const router = Router();
const usersController = require("../controllers/usersController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", usersController.register);
router.post("/login", usersController.login);
router.get("/check", authMiddleware, usersController.check)
router.get("/getUsersRolesStats", usersController.getUsersRolesStats);

module.exports = router;