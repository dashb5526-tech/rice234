import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const homeFilePath = path.join(process.cwd(), 'src/lib/data/home.json');

async function getHomeData() {
    try {
        const data = await fs.readFile(homeFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {
            brand: { name: "", logoUrl: null },
            hero: { headline: "", subheadline: "", imageUrl: "", imageHint: "" }
        };
    }
}

export async function GET() {
  try {
    const data = await getHomeData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error handling GET request for home data:', error);
    return NextResponse.json({ error: 'Failed to retrieve home content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const content = await request.json();
    await fs.writeFile(homeFilePath, JSON.stringify(content, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving home file:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
