import express = require("express");
import Stat from "../../stats/model";

let router = express.Router();

router.get("/:id/delete", async (req, res) => {
    await Stat.findByIdAndDelete(req.params.id)
    res.redirect("/admin");
});

export default router;