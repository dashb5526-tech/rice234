import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const productsSectionFilePath = path.join(process.cwd(), 'src/lib/data/products-section.json');

async function getProductsSectionData() {
    try {
        const data = await fs.readFile(productsSectionFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {
            title: "Our Premium Rice Selection",
            description: "We offer a diverse range of high-quality rice to meet the needs of every customer, from households to large-scale businesses."
        };
    }
}

export async function GET() {
  try {
    const data = await getProductsSectionData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error handling GET request for products section data:', error);
    return NextResponse.json({ error: 'Failed to retrieve products section content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const content = await request.json();
    await fs.writeFile(productsSectionFilePath, JSON.stringify(content, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving products section file:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
