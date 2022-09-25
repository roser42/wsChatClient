import dotenv from 'dotenv';

dotenv.config();
const {SERVER_IP} = process.env;

if (!SERVER_IP) {
    throw new Error('Missing environment variables ❌');
}

const config: Record<string, string> = {
    SERVER_IP,
};

export default config;
