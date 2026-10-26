import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import { Ytdl, Client } from '@distube/ytdl-core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ytCookie = process.env.YT_COOKIE?.trim();
// Use Tv & VisionOS clients to avoid web decipher script blocks from YouTube datacenter IPs
const yt = new Ytdl({
  clients: [Client.Tv, Client.VisionOS],
  cookie: ytCookie || undefined,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse('Missing track id parameter', { status: 400 });
  }

  try {
    const rangeHeader = req.headers.get('range');
    let start = 0;
    const downloadOpts: any = {
      filter: { hasAudio: true, hasVideo: false },
      quality: 'highestaudio',
    };

    if (rangeHeader) {
      const match = rangeHeader.match(/bytes=(\d+)-/);
      if (match) {
        start = parseInt(match[1], 10);
        downloadOpts.range = { start };
      }
    }

    const nodeStream = yt.download(`https://www.youtube.com/watch?v=${id}`, downloadOpts);

    // Convert Node.js readable stream to Web standard ReadableStream
    const webStream = Readable.toWeb(nodeStream);

    const headers = new Headers();
    headers.set('Content-Type', 'audio/mp4');
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Cache-Control', 'public, max-age=3600');

    if (rangeHeader && start > 0) {
      headers.set('Content-Range', `bytes ${start}-/*`);
      return new NextResponse(webStream as any, {
        status: 206,
        headers,
      });
    }

    return new NextResponse(webStream as any, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    console.error('Stream route error for id', id, ':', err?.message || err);
    return NextResponse.json(
      {
        error: 'Error streaming audio',
        message: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}

