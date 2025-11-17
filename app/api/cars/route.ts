import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Ambil semua mobil
export async function GET() {
    const cars = await prisma.car.findMany({
        orderBy: { createdAt: 'desc' }, // Urutkan dari yang terbaru
    });
    return NextResponse.json(cars);
}

// POST: Tambah mobil baru
export async function POST(request: Request) {
    const body = await request.json();
    const { brand, model, year, description } = body;

    const newCar = await prisma.car.create({
        data: {
            brand,
            model,
            year,
            description,
        },
    });

    return NextResponse.json(newCar);
}