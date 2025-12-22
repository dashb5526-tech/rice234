import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const contactInfoFilePath = path.join(process.cwd(), 'src/lib/data/contact-info.json');

async function getContactInfoData() {
    try {
        const data = await fs.readFile(contactInfoFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { address: "", phone: "", email: "", whatsappNumber: "" };
    }
}

export async function GET() {
  try {
    const data = await getContactInfoData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error handling GET request for contact info:', error);
    return NextResponse.json({ error: 'Failed to retrieve contact info' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const content = await request.json();
    await fs.writeFile(contactInfoFilePath, JSON.stringify(content, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving contact info file:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
