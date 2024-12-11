import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    text: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: null
    },
    set: {
        type: String,
        required: true
    },
    tasks: {
        type: [String],
        required: true
    },
    resources: {
        type: [String],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 1
    }
});

// Middlewares
skillSchema.pre('save', function(next) {
    next();
});

export default mongoose.model('Skill', skillSchema);