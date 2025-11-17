import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = {
    params: Promise<{ id: string }>
}

// 1. GET By ID
export async function GET(request: Request, props: Params) {
    try {
        const params = await props.params;
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
        }

        const car = await prisma.car.findUnique({
            where: { id },
        });

        if (!car) {
            return NextResponse.json({ error: 'Mobil tidak ditemukan' }, { status: 404 });
        }

        return NextResponse.json(car);
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// 2. DELETE
export async function DELETE(request: Request, props: Params) {
    try {
        const params = await props.params;
        const id = parseInt(params.id);

        if (isNaN(id)) return NextResponse.json({ error: 'ID Invalid' }, { status: 400 });

        await prisma.car.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ error: 'Gagal menghapus data' }, { status: 500 });
    }
}

// 3. PUT (Update)
export async function PUT(request: Request, props: Params) {
    try {
        // FIX: Await params untuk Next.js 15+
        const params = await props.params;
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
        }

        const body = await request.json();
        const { brand, model, year, description } = body;

        console.log(`Processing Update for ID: ${id}`, body);

        // Cek data lama
        const existingCar = await prisma.car.findUnique({ where: { id } });
        if (!existingCar) {
            return NextResponse.json({ error: "Data tidak ditemukan di database" }, { status: 404 });
        }

        // Update
        const updatedCar = await prisma.car.update({
            where: { id },
            data: {
                brand,
                model,
                year,
                description,
            },
        });

        return NextResponse.json(updatedCar);

    } catch (error) {
        console.error("PUT Error (Server Side):", error);
        return NextResponse.json({ error: 'Gagal mengupdate data' }, { status: 500 });
    }
}