const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const { validationResult } = require('express-validator');
const { courseValidators } = require('../utils/validators');


const router = Router();

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Add courses',
        isAdd: true
    })
})

router.post('/', auth, courseValidators, async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).render('add', {
            title: 'Add course',
            isAdd: true,
            error: error.array()[0].msg,
            data: {
                ...req.body
            }
        })
    }
    const course = new Course({
        userId: req.user._id,
        ...req.body
    });

    try {
        await course.save();
        res.redirect('/courses');
    } catch (e) {
        console.error(e)
    }
})

module.exports = router;