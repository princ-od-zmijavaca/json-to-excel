const express = require("express");
const mainRouter = require("../controllers/mainroutercontroller");

const router = express.Router()

router.route('/').post(mainRouter.postJSONData);

module.exports = router;