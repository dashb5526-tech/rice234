import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const productsFilePath = path.join(process.cwd(), 'src/lib/data/products.json');

async function getProductsData() {
    try {
        const data = await fs.readFile(productsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function GET() {
  try {
    const products = await getProductsData();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error reading products file:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const products = await request.json();
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving products file:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
