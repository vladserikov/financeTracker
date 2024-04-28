import { Router } from 'express';
import Wallet from '../models/wallet';
import User from '../models/user';
import { Types } from 'mongoose';

const walletRouter = Router();

type CreateWalletObj = {
    name: string;
    userId: Types.ObjectId;
    amount?: number;
    unit?: string;
};

const createWallet = (createObj: CreateWalletObj) => {
    const { amount = 0, name, userId, unit = 'USD' } = createObj;

    const newWallet = new Wallet({
        amount,
        name,
        userId,
        unit,
    });

    return newWallet;
};

walletRouter.get('/', async (req, res) => {
    const userWallets = await Wallet.find({ userId: req.userRequest?.id }).populate('transactions');
    res.status(200).json(userWallets);
});

walletRouter.get('/:id', async (req, res) => {
    const wallet = await Wallet.findById(req.params.id).populate('transactions');

    if (req.userRequest?.id !== wallet?.userId?.toString()) {
        return res.status(401).json({ error: 'use the right wallet' });
    }

    return res.status(201).json(wallet);
});

walletRouter.post('/', async (req, res) => {
    const user = await User.findById(req.userRequest?.id);

    if (!user) {
        return res.status(401).json({ error: 'login please' });
    }

    const { body } = req;
    const { amount, name, unit } = body;

    const newWallet = createWallet({ unit, amount, name, userId: user._id });

    const saveWallet = await newWallet.save();

    user.wallets = user.wallets.concat(saveWallet._id);
    await user.save();

    return res.status(201).json(saveWallet);
});

walletRouter.put('/:id', async (req, res) => {
    const { body } = req;
    const wallet = await Wallet.findById(req.params.id);

    if (!wallet || wallet.userId?.toString() !== req.userRequest?.id) {
        return res.status(404).json({ error: 'unknown id' });
    }

    const newWallet = {
        amount: body.amount || wallet.amount,
        name: body.name || wallet.name,
        unit: body.unit || wallet.unit,
    };

    const updateWallet = await Wallet.findByIdAndUpdate(wallet.id, newWallet, { new: true });

    return res.status(201).json(updateWallet);
});

walletRouter.delete('/:id', async (req, res) => {
    const wallet = await Wallet.findById(req.params.id);

    if (!wallet || wallet.userId?.toString() !== req.userRequest?.id) {
        return res.status(404).json({ error: 'unknown id' });
    }

    await Wallet.findByIdAndDelete(req.params.id);

    return res.status(204).end();
});

export default walletRouter;

