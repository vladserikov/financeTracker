import bcrypt from 'bcrypt';
import { Router } from 'express';
import User from '../models/user';
import Storage from '../models/storage';

const userRouter = Router();

userRouter.post('/', async (req, res) => {
    const { body } = req;
    const { username, name, password } = body;

    const sault = 10;
    const passwordHash = await bcrypt.hash(password, sault);

    const newUser = new User({
        name,
        passwordHash,
        username,
    });

    const savedUser = await newUser.save();

    const newStorage = new Storage({
        amount: 0,
        name: 'Main',
        userId: savedUser._id,
    });

    const savedStorage = await newStorage.save();

    savedUser.storages = savedUser.storages.concat(savedStorage._id);
    await savedUser.save();

    res.status(201).json(savedUser);
});

export default userRouter;
