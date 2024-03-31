import { Router, Request, Response } from 'express';
import User from '../models/user';
import Storage from '../models/storage';
import Transaction from '../models/transaction';

const transactionRouter = Router();

type Transaction = {
    transactionType: 'Income' | 'Expense';
    amount: number;
    category: string;
    unit: string;
    date?: Date;
    comment?: string;
    storageId?: string;
};

type GetRequest = Omit<Request, 'body'> & { body: Transaction };

transactionRouter.post('/', async (req: GetRequest, res: Response) => {
    const { body, userRequest } = req;

    const { storageId, amount = 0, category, transactionType, unit = 'USD', comment, date = new Date() } = body;

    const user = await User.findById(userRequest?.id);

    if (!user) {
        return res.status(401).json({
            error: 'login please',
        });
    }

    let storage = await Storage.findById(storageId);

    if (!storage) {
        const newStorage = new Storage({
            amount: 0,
            name: 'default',
            transactions: [],
            userId: user._id,
        });

        storage = await newStorage.save();
    }

    const newTransaction = new Transaction({
        amount,
        category,
        comment,
        date,
        unit,
        transactionType,
        userId: user._id,
        storage: storage._id,
    });

    const saveTransaction = await newTransaction.save();

    storage.transactions = storage.transactions.concat(saveTransaction._id);
    await storage.save();

    return res.status(201).json(saveTransaction);
});

export default transactionRouter;
