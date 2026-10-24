import { NextResponse } from 'next/server';
import { ytGetSearchSuggestions } from '@/lib/ytmusic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || !q.trim() || q.trim().length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const suggestions = await ytGetSearchSuggestions(q.trim());
  return NextResponse.json({ suggestions });
}
