import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const testimonialsFilePath = path.join(process.cwd(), 'src/lib/data/testimonials.json');

async function getTestimonialsData() {
    try {
        const data = await fs.readFile(testimonialsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function GET() {
  try {
    const data = await getTestimonialsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading testimonials file:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const testimonials = await request.json();
    await fs.writeFile(testimonialsFilePath, JSON.stringify(testimonials, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving testimonials file:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
