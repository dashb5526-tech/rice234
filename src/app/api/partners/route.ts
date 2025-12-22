import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const partnersFilePath = path.join(process.cwd(), 'src/lib/data/partners.json');

async function getPartnersData() {
    try {
        const data = await fs.readFile(partnersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function GET() {
  try {
    const data = await getPartnersData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading partners file:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const partners = await request.json();
    await fs.writeFile(partnersFilePath, JSON.stringify(partners, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving partners file:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
