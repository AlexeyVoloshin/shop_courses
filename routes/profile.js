const auth = require('../middleware/auth');
const User = require('../models/user');
const { Router } = require('express');

const router = Router();

router.get('/', auth, async (req, res) => {
    res.render('profile', {
        title: 'Profile person',
        isProfile: true,
        user: req.user.toObject()
    })
})

router.post('/', auth, async (req, res) => {
    const { name } = req.body;
    const path = req.file.path.split('\\').join('\\');

    try {
        const user = await User.findById(req.user._id);

        const data = {
            name
        }

        if (req.file) {
            data.avatarUrl = path;
        }

        Object.assign(user, data);
        await user.save();
        res.redirect('/profile');
    } catch (e) {
        console.error(e);
    }
})

module.exports = router;