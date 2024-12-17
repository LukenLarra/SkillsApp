import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    bitpoints_min: {
        type: Number,
        required: true
    },
    bitpoints_max: {
        type: Number,
        required: true
    },
    image_url: {
        type: String,
        required: true
    }

}, {collection: 'Badge'});

// Middlewares
badgeSchema.pre('save', function (next) {
    next();
});

export default mongoose.model('Badge', badgeSchema);