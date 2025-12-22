import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const testimonialsSectionFilePath = path.join(process.cwd(), 'src/lib/data/testimonials-section.json');

async function getTestimonialsSectionData() {
    try {
        const data = await fs.readFile(testimonialsSectionFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {
            title: "Trusted by the Best",
            description: "Hear what our valued clients have to say about our products and services."
        };
    }
}

export async function GET() {
  try {
    const data = await getTestimonialsSectionData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error handling GET request for testimonials section data:', error);
    return NextResponse.json({ error: 'Failed to retrieve testimonials section content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const content = await request.json();
    await fs.writeFile(testimonialsSectionFilePath, JSON.stringify(content, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving testimonials section file:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
