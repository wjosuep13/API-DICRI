import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { compareHash, hashText } from '../utils/crypto';
import { getLoginInfo } from '../repositories/auth.repository';

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const loginInfo = await getLoginInfo(username);
        if (!loginInfo) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const { password: dbPassword, id, rol } = loginInfo;
        if (!dbPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = compareHash(password, dbPassword);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId:id, role:rol }, process.env.SECRET_KEY!, { expiresIn: '1h' });

        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};