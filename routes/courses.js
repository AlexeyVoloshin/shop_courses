const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');

const router = Router();

router.get('/', async (req, res) => {
    const courses = await Course.find();
    res.render('courses', {
        title: 'Courses',
        isCourses: true,
        courses
    })
})
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        res.render('course', {
            layout: 'empty',
            title: `Курс ${course.title}`,
            course
        });
    } catch (e) {
        console.error(e);
    }
})
router.get('/:id/edit', auth, async (req, res) => {
    try {
        if (!req.query.allow) { //checking for the presence of the 'query' property, which allows us to edit
            return res.redirect('/');
        }
        const course = await Course.findById(req.params.id);
        res.render('course-edit', {
            title: `Редактировать ${course.title}`,
            course
        })
    } catch (e) { console.error(e) }
})
router.post('/edit', auth, async (req, res) => {
    try {
        const { id, ...data } = req.body;

        await Course.findByIdAndUpdate(id, data);

        res.redirect('/courses');
    } catch (e) {
        console.error(e);
    }
})
router.post('/remove', auth, async (req, res) => {
    try {
        await Course.findByIdAndRemove(req.body.id);
        res.redirect('/courses');
    } catch (e) {
        console.error(e);
    }
})
module.exports = router;