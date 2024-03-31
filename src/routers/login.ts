import { Router } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECRET } from '../utils/config';

const loginRouter = Router();

loginRouter.post('/', async (req, res) => {
    const { body } = req;
    const { username, password } = body;

    const user = await User.findOne({ username });
    const correctPassword = user ? await bcrypt.compare(password, user.passwordHash ?? '') : false;

    if (!user || !correctPassword) {
        return res.status(401).json({ error: 'invalid username or password' });
    }

    const userToken = {
        username,
        id: user.id,
    };

    const token = jwt.sign(userToken, SECRET);

    return res.status(201).json({
        token,
        username,
        name: user.name,
    });
});

export default loginRouter;
