import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillsApp');
        console.log('MongoDB conectado');
    } catch (error) {
        console.error('Error en la conexión a MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB;