const { Router } = require("express");
const Order = require("../models/order");
const auth = require('../middleware/auth');

const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id }).populate(
      "user.userId"
    );

    res.render("orders", {
      title: "Orders",
      isOrders: true,
      orders: orders.map((order) => {
        return {
          ...order._doc,
          price: order.courses.reduce((total, c) => {
            return (total += c.count * c.course.price);
          }, 0),
        };
      }),
    });
  } catch (e) {
    console.error(e);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const user = await req.user
      .populate("basket.items.courseId")
      .execPopulate();

    const courses = user.basket.items.map((course) => ({
      count: course.count,
      course: { ...course.courseId._doc },
    }));
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      courses: courses,
    });

    await order.save();
    await req.user.clearBasket();

    res.redirect("/orders");
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
