import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const seoFilePath = path.join(process.cwd(), 'src/lib/data/seo.json');

async function getSeoData() {
    try {
        const data = await fs.readFile(seoFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {
            title: "Dash Rice Traders",
            description: "A trusted rice trading and distribution company providing high-quality rice varieties.",
            keywords: "rice, basmati, sona masoori, parboiled, wholesale, export, trading, distribution"
        };
    }
}

export async function GET() {
  try {
    const data = await getSeoData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error handling GET request for SEO data:', error);
    return NextResponse.json({ error: 'Failed to retrieve SEO content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const content = await request.json();
    await fs.writeFile(seoFilePath, JSON.stringify(content, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving SEO file:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
