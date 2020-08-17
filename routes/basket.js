const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');

const router = Router();
function basketItems(basket) {
    return basket.items.map(c => ({
        ...c.courseId._doc,
        id: c.courseId.id, //add a new key to convert '_id' to 'id' in the course model 
        count: c.count
    }))
}
function countPrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count;
    }, 0)
}
router.post('/add', auth, async (req, res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToBasket(course);
    res.redirect('/basket');
})
router.delete('/remove/:id', auth, async (req, res) => {
    await req.user.removeFromBasket(req.params.id);
    const user = await req.user
        .populate('basket.items.courseId')
        .execPopulate();

    const courses = basketItems(user.basket)
    const basket = {
        courses,
        price: countPrice(courses)
    }
    res.status(200).json(basket);
})
router.get('/', auth, async (req, res) => {
    const user = await req.user
        .populate('basket.items.courseId')
        .execPopulate();
    const courses = basketItems(user.basket)

    res.render('basket', {
        title: 'Basket',
        isBasket: true,
        courses: courses,
        price: countPrice(courses)
    })
})

module.exports = router;