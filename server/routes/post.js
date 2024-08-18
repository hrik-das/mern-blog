const { Router } = require("express");

const { create, edit, deletee, self, category, posts, post } = require("../controllers/post");
const auth = require("../middleware/auth");

const router = Router();

router.get("/", posts);
router.get("/:id", post);
router.get("/users/:id", self);
router.get("/categories/:category", category);

router.post("/", auth, create);

router.patch("/:id", auth, edit);

router.delete("/:id", auth, deletee);

module.exports = router;