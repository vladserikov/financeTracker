import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minLength: 4,
    },
    amount: {
        type: Number,
        min: 0,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
        },
    ],
    unit: {
        type: String,
        default: 'USD',
    },
});

walletSchema.set('toJSON', {
    transform: (_, returnObj) => {
        returnObj.id = returnObj._id.toString();
        delete returnObj._id;
        delete returnObj.__v;
    },
});

export default mongoose.model('Wallet', walletSchema);

