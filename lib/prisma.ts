import { PrismaClient } from '@prisma/client';
import path from 'path';

// Mencegah multiple instance saat hot-reloading di development
declare global {
    // eslint-disable-next-line no-var
    var cachedPrisma: PrismaClient | undefined;
}

// Workaround untuk menemukan file db di production (Vercel/Render)
const filePath = path.join(process.cwd(), 'prisma/dev.db');

const config = {
    datasources: {
        db: {
            url: 'file:' + filePath,
        },
    },
};

let prismaInstance: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prismaInstance = new PrismaClient(config);
} else {
    if (!global.cachedPrisma) {
        global.cachedPrisma = new PrismaClient(config);
    }
    prismaInstance = global.cachedPrisma;
}

// PENTING: Kita export dengan nama 'prisma' (bukan 'db') 
// agar file-file API route kamu yang lain tidak error.
export const prisma = prismaInstance;