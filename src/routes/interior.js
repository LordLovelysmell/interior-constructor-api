const express = require("express");
const router = express.Router();
const authenticateAccessToken = require("../middleware/authenticateAccessToken");
const Interior = require("../models/Interior");
const User = require("../models/User");

router.all("*", authenticateAccessToken);

router.get("/", async (req, res) => {
    const interiors = await Interior.find({ id: req.user.id });

    return res.status(200).json({ interiors })
});

router.post("/", async (req, res) => {
    const { name } = req.body;

    const interior = new Interior({
        name
    });

    const savedInterior = await interior.save();
    await User.findByIdAndUpdate(req.user.id, { "$push": { "interiors": savedInterior._id } });

    return res.status(200).json({ interior });
});

module.exports = router;