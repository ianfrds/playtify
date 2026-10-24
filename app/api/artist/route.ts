import { NextResponse } from 'next/server';
import { ytGetArtist } from '@/lib/ytmusic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || !q.trim()) {
    return NextResponse.json({ error: 'Missing artist query' }, { status: 400 });
  }

  const data = await ytGetArtist(q.trim());
  if (data && data.name) {
    return NextResponse.json(data);
  }

  return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
}
