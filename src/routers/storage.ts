import { Router } from 'express';
import Storage from '../models/storage';
import User from '../models/user';
import { Types } from 'mongoose';

const storageRouter = Router();

type CreateStorageObj = {
    name: string;
    userId: Types.ObjectId;
    amount?: number;
    unit?: string;
};

const createStorage = (createObj: CreateStorageObj) => {
    const { amount = 0, name, userId, unit = 'USD' } = createObj;

    const newStorage = new Storage({
        amount,
        name,
        userId,
        unit,
    });

    return newStorage;
};

storageRouter.get('/', async (req, res) => {
    const userStorages = await Storage.find({ userId: req.userRequest?.id }).populate('transactions');
    res.status(200).json(userStorages);
});

storageRouter.get('/:id', async (req, res) => {
    const storage = await Storage.findById(req.params.id).populate('transactions');

    if (req.userRequest?.id !== storage?.userId?.toString()) {
        return res.status(401).json({ error: 'use the right storage' });
    }

    return res.status(201).json(storage);
});

storageRouter.post('/', async (req, res) => {
    const user = await User.findById(req.userRequest?.id);

    if (!user) {
        return res.status(401).json({ error: 'login please' });
    }

    const { body } = req;
    const { amount, name, unit } = body;

    const newStorage = createStorage({ unit, amount, name, userId: user._id });

    const saveStorage = await newStorage.save();

    user.storages = user.storages.concat(saveStorage._id);
    await user.save();

    return res.status(201).json(saveStorage);
});

storageRouter.put('/:id', async (req, res) => {
    const { body } = req;
    const storage = await Storage.findById(req.params.id);

    if (!storage || storage.userId?.toString() !== req.userRequest?.id) {
        return res.status(404).json({ error: 'unknown id' });
    }

    const newStorage = {
        amount: body.amount || storage.amount,
        name: body.name || storage.name,
        unit: body.unit || storage.unit,
    };

    const updateStorage = await Storage.findByIdAndUpdate(storage.id, newStorage, { new: true });

    return res.status(201).json(updateStorage);
});

storageRouter.delete('/:id', async (req, res) => {
    const storage = await Storage.findById(req.params.id);

    if (!storage || storage.userId?.toString() !== req.userRequest?.id) {
        return res.status(404).json({ error: 'unknown id' });
    }

    await Storage.findByIdAndDelete(req.params.id);

    return res.status(204).end();
});

export default storageRouter;
