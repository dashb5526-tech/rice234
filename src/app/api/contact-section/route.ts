import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const contactSectionFilePath = path.join(process.cwd(), 'src/lib/data/contact-section.json');

async function getContactSectionData() {
    try {
        const data = await fs.readFile(contactSectionFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {
            title: "Get In Touch",
            description: "We're here to help with your inquiries and bulk orders. Reach out to us today!"
        };
    }
}

export async function GET() {
  try {
    const data = await getContactSectionData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error handling GET request for contact section data:', error);
    return NextResponse.json({ error: 'Failed to retrieve contact section content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const content = await request.json();
    await fs.writeFile(contactSectionFilePath, JSON.stringify(content, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving contact section file:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
