
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

const contactInfoSchema = z.object({
  address: z.string(),
  phone: z.string(),
  email: z.string().email(),
  imageUrl: z.string().url(),
  imageHint: z.string(),
});

const dataFilePath = path.join(process.cwd(), 'src/lib/data/contact-info.json');

async function readData() {
  const fileContents = await fs.readFile(dataFilePath, 'utf8');
  return JSON.parse(fileContents);
}

async function writeData(data: any) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse('Error reading contact information', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const validatedData = contactInfoSchema.parse(json);
    await writeData(validatedData);
    return new NextResponse(JSON.stringify(validatedData), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }
    return new NextResponse('Error writing contact information', { status: 500 });
  }
}
