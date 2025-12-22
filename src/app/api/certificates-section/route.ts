import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const certificatesSectionFilePath = path.join(process.cwd(), 'src/lib/data/certificates-section.json');

async function getCertificatesSectionData() {
    try {
        const data = await fs.readFile(certificatesSectionFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {
            title: "Our Certifications",
            description: "We are committed to quality and safety, backed by industry-standard certifications."
        };
    }
}

export async function GET() {
  try {
    const data = await getCertificatesSectionData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error handling GET request for certificates section data:', error);
    return NextResponse.json({ error: 'Failed to retrieve certificates section content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const content = await request.json();
    await fs.writeFile(certificatesSectionFilePath, JSON.stringify(content, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving certificates section file:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
