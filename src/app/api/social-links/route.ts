import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const socialLinksFilePath = path.join(process.cwd(), 'src/lib/data/social-links.json');

async function getSocialLinksData() {
    try {
        const data = await fs.readFile(socialLinksFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function GET() {
  try {
    const data = await getSocialLinksData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading social links file:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const socialLinks = await request.json();
    await fs.writeFile(socialLinksFilePath, JSON.stringify(socialLinks, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving social links file:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
