import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
        minLength: 4,
        maxLength: 28,
    },
    name: {
        type: String,
        require: true,
    },
    passwordHash: {
        type: String,
        require: true,
    },
    storages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Storage',
        },
    ],
});

userSchema.set('toJSON', {
    transform: (_, returnObj) => {
        returnObj.id = returnObj._id.toString();
        delete returnObj._id;
        delete returnObj.__v;

        delete returnObj.passwordHash;
    },
});

export default mongoose.model('User', userSchema);
