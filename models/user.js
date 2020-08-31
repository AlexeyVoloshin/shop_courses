const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatarUrl: String,
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExp: Date,
  basket: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
      },
    ],
  },
});
userSchema.methods.clearBasket = function () {
  this.basket = { items: [] };
  return this.save();
};
userSchema.methods.removeFromBasket = function (id) {
  let items = [...this.basket.items];
  const idx = items.findIndex((c) => {
    return c.courseId.toString() === id.toString();
  });
  if (items[idx].count === 1) {
    //delete course from basket
    items.splice(idx, 1);
  } else {
    //reduce  count
    items[idx].count--;
  }
  this.basket = { items };
  return this.save();
};
userSchema.methods.addToBasket = function (course) {
  const items = [...this.basket.items]; //clone the array
  const idx = items.findIndex((c) => {
    return c.courseId.toString() === course._id.toString();
  });
  if (idx >= 0) {
    items[idx].count = items[idx].count + 1;
  } else {
    items.push({
      count: 1,
      courseId: course._id.toString(),
    });
  }
  this.basket = { items };
  return this.save();
};
module.exports = model("User", userSchema);
