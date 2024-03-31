import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        category: String,
        unit: String,
        date: Date,
        comment: String,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        storage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Storage',
        },
        transactionType: {
            type: String,
            enum: ['Income', 'Expense'],
            required: true,
        },
    },
    { timestamps: true },
);

transactionSchema.set('toJSON', {
    transform: (_, returnObj) => {
        returnObj.id = returnObj._id.toString();
        delete returnObj._id;
        delete returnObj.__v;
    },
});

export default mongoose.model('Transaction', transactionSchema);
