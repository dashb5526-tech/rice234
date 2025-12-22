import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const galleryFilePath = path.join(process.cwd(), 'src/lib/data/gallery.json');

async function getGalleryData() {
    try {
        const data = await fs.readFile(galleryFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { 
            title: "From the Fields to Your Door",
            description: "A glimpse into our process, our products, and the people who make it all happen.",
            galleryImages: [] 
        };
    }
}

export async function GET() {
  try {
    const data = await getGalleryData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading gallery file:', error);
    return NextResponse.json({ 
        title: "Error", 
        description: "Could not load gallery content.", 
        galleryImages: [] 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const content = await request.json();
    await fs.writeFile(galleryFilePath, JSON.stringify(content, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving gallery file:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
