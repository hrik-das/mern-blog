const { Router } = require("express");

const { register, login, profile, avatar, edit, authors } = require("../controllers/user");
const auth = require("../middleware/auth");

const router = Router();

router.get("/", authors);
router.get("/:id", profile);

router.post("/register", register);
router.post("/login", login);
router.post("/change-avatar", auth, avatar);

router.patch("/edit-user", auth, edit);

module.exports = router;