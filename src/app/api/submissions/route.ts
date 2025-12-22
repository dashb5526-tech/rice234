
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const submissionsFilePath = path.join(process.cwd(), 'src/lib/data/submissions.json');

async function getSubmissionsData() {
    try {
        const data = await fs.readFile(submissionsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist, create it with an empty array
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await fs.writeFile(submissionsFilePath, JSON.stringify([], null, 2));
            return [];
        }
        return [];
    }
}

export async function GET() {
  try {
    const data = await getSubmissionsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading submissions file:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const submissions = await request.json();
    await fs.writeFile(submissionsFilePath, JSON.stringify(submissions, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving submissions file:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
