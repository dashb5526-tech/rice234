import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const termsFilePath = path.join(process.cwd(), 'src/lib/data/terms.json');

async function getTermsData() {
    try {
        const data = await fs.readFile(termsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {
            title: "Terms and Conditions",
            content: "Please add your terms and conditions here."
        };
    }
}

export async function GET() {
  try {
    const data = await getTermsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error handling GET request for terms data:', error);
    return NextResponse.json({ error: 'Failed to retrieve terms content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const content = await request.json();
    await fs.writeFile(termsFilePath, JSON.stringify(content, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving terms file:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
