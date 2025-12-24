
import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = 'AIzaSyCZ2qQCLgvUO5C5pUOYHHLHFkL-dqCF4i0';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt,
          }],
        }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API request failed:', errorText);
      return NextResponse.json({ error: `Gemini API request failed: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    
    if (data.promptFeedback && data.promptFeedback.blockReason) {
        return NextResponse.json({ error: `Request was blocked: ${data.promptFeedback.blockReason}` }, { status: 400 });
    }

    if (!data.candidates || data.candidates.length === 0) {
      return NextResponse.json({ error: 'No content generated' }, { status: 500 });
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Attempt to parse the text as JSON, if it fails, return as plain text.
    try {
        const jsonResponse = JSON.parse(generatedText);
        return NextResponse.json(jsonResponse);
    } catch (e) {
        return NextResponse.json({ text: generatedText });
    }

  } catch (error: any) {
    console.error('Error in generate API:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
