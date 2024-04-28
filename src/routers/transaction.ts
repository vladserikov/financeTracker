import { Router, Request, Response } from 'express';
import User from '../models/user';
import Wallet from '../models/wallet';
import Transaction from '../models/transaction';

const transactionRouter = Router();

type Transaction = {
    transactionType: 'Income' | 'Expense';
    amount: number;
    category: string;
    unit: string;
    date?: Date;
    comment?: string;
    walletId?: string;
};

type GetRequest = Omit<Request, 'body'> & { body: Transaction };

transactionRouter.post('/', async (req: GetRequest, res: Response) => {
    const { body, userRequest } = req;

    const { walletId, amount = 0, category, transactionType, unit = 'USD', comment, date = new Date() } = body;

    const user = await User.findById(userRequest?.id);

    if (!user) {
        return res.status(401).json({
            error: 'login please',
        });
    }

    const wallet = await Wallet.findById(walletId);

    if (!wallet) {
        return res.status(402).json({
            error: 'Select wallet',
        });
    }

    const newTransaction = new Transaction({
        amount,
        category,
        comment,
        date,
        unit,
        transactionType,
        userId: user._id,
        wallet: wallet._id,
    });

    const saveTransaction = await newTransaction.save();

    wallet.transactions = wallet.transactions.concat(saveTransaction._id);
    if (!wallet.amount) {
        wallet.amount = amount;
    } else {
        wallet.amount += amount;
    }

    await wallet.save();

    return res.status(201).json(saveTransaction);
});

transactionRouter.put('/:id', async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);
    if (transaction?.userId?.toString() !== req.userRequest?.id) {
        return res.status(401).end();
    }

    const { amount, category, unit, date, comment } = req.body;

    const updateTransaction = await Transaction.findByIdAndUpdate(
        req.params.id,
        { amount, category, unit, date, comment },
        { new: true },
    );

    return res.status(204).json(updateTransaction);
});

transactionRouter.delete('/:id', async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);
    if (transaction?.userId?.toString() !== req.userRequest?.id) {
        return res.status(401).end();
    }

    await transaction?.deleteOne();

    return res.status(204).end();
});

export default transactionRouter;

