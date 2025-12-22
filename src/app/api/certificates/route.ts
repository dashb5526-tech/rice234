import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const certificatesFilePath = path.join(process.cwd(), 'src/lib/data/certificates.json');

async function getCertificatesData() {
    try {
        const data = await fs.readFile(certificatesFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function GET() {
  try {
    const data = await getCertificatesData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading certificates file:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const certificates = await request.json();
    await fs.writeFile(certificatesFilePath, JSON.stringify(certificates, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving certificates file:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
