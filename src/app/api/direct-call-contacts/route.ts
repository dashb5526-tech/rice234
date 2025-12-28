import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

const jsonFilePath = path.join(process.cwd(), 'src', 'lib', 'data', 'direct-call-contacts.json');

interface DirectCallContact {
    id: number;
    name: string;
    role: string;
    phone: string;
}

export async function GET() {
    try {
        const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
        const contacts: DirectCallContact[] = JSON.parse(fileContent);
        return NextResponse.json(contacts);
    } catch (error) {
        if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
            return NextResponse.json([]);
        }
        console.error('Failed to read direct call contacts:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const updatedContacts = await request.json();
        await fs.writeFile(jsonFilePath, JSON.stringify(updatedContacts, null, 2), 'utf-8');
        return NextResponse.json({ message: 'Contacts updated successfully' });
    } catch (error) {
        console.error('Failed to write direct call contacts:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
