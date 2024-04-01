import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const MONGO_URI =
    process.env.NODE_ENV !== 'test' ? process.env.MONGO_URI || '' : (process.env.TEST_MONGO_URI as string);
export const SECRET = process.env.SECRET || 'nihua';

