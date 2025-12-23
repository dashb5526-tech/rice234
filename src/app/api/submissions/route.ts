
import { NextRequest, NextResponse } from 'next/server';
import { saveSubmission, getInquiries, getOrders } from '@/lib/submissions';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    let data;
    if (type === 'order') {
      data = await getOrders();
    } else {
      data = await getInquiries();
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const submissionData = await request.json();
    const result = await saveSubmission(submissionData);

    if (result.success) {
      return NextResponse.json({ success: true, message: result.message, id: result.id });
    } else {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }
  } catch (error) {
    console.error('Error saving submission:', error);
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
  }
}
