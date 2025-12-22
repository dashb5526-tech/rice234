import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const aboutFilePath = path.join(process.cwd(), 'src/lib/data/about.json');

async function getAboutData() {
    try {
        const data = await fs.readFile(aboutFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {
          main: { title: "", paragraph1: "", paragraph2: "", imageUrl: "", imageHint: "" },
          services: { title: "", items: [] }
        };
    }
}

export async function GET() {
  try {
    const data = await getAboutData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error handling GET request for about data:', error);
    return NextResponse.json({ error: 'Failed to retrieve about content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const content = await request.json();
    await fs.writeFile(aboutFilePath, JSON.stringify(content, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving about file:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
