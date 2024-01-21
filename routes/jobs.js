var express = require('express');
var router = express.Router();
const Job = require('../models/Job');

/* POST jobs listing. */
router.post('/', async function (req, res, next) {
    try {
        const job = new Job(req.body);
        await job.save();
        res.status(201).send(job);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
