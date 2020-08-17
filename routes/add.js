const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');

const router = Router();

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Add courses',
        isAdd: true
    })
})

router.post('/', auth, async (req, res) => {

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