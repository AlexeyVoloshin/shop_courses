const {Schema, model} = require('mongoose');

const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: String,
    count: {
        type: Number,
        default: 0,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})
courseSchema.method('toClient', function() {
    const course = this.toObject();
    console.log('Schema1', course)

    course.id = course._id;
    delete course._id;
console.log('Schema2', course)
    return course
})
module.exports = model('Course', courseSchema)