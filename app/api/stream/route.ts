import { NextRequest, NextResponse } from 'next/server';
import { Ytdl } from '@distube/ytdl-core';

interface CachedFormat {
  url: string;
  mimeType: string;
  contentLength: number;
  expires: number;
}

const formatCache = new Map<string, CachedFormat>();
const ytCookie = process.env.YT_COOKIE?.trim();
const yt = new Ytdl(ytCookie ? { cookie: ytCookie } : undefined);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse('Missing track id parameter', { status: 400 });
  }

  try {
    let cached = formatCache.get(id);
    const now = Date.now();

    if (!cached || cached.expires < now) {
      const info = await yt.getInfo(`https://www.youtube.com/watch?v=${id}`);
      const audioFormats = info.formats.filter((f) => !f.hasVideo && f.hasAudio && f.url);
      
      // Prioritize itag 140 (audio/mp4 - AAC) for universal iOS & Android mobile compatibility
      const chosen =
        audioFormats.find((f) => f.itag === 140) ||
        audioFormats.sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0))[0];

      if (!chosen || !chosen.url) {
        return new NextResponse('Audio stream not available', { status: 404 });
      }

      cached = {
        url: chosen.url,
        mimeType: chosen.mimeType?.split(';')[0] || 'audio/mp4',
        contentLength: parseInt(String(chosen.contentLength || '0'), 10),
        expires: now + 45 * 60 * 1000, // 45 minutes cache
      };
      formatCache.set(id, cached);
    }

    const rangeHeader = req.headers.get('range');
    const targetHeaders: Record<string, string> = {
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    };
    if (rangeHeader) {
      targetHeaders['Range'] = rangeHeader;
    }

    const upstreamRes = await fetch(cached.url, {
      headers: targetHeaders,
    });

    if (!upstreamRes.ok && upstreamRes.status !== 206) {
      formatCache.delete(id);
      return new NextResponse('Upstream stream error', { status: upstreamRes.status });
    }

    const resHeaders = new Headers();
    resHeaders.set('Content-Type', cached.mimeType);
    resHeaders.set('Accept-Ranges', 'bytes');
    resHeaders.set('Cache-Control', 'public, max-age=3600');

    const contentRange = upstreamRes.headers.get('content-range');
    if (contentRange) {
      resHeaders.set('Content-Range', contentRange);
    }
    const contentLength = upstreamRes.headers.get('content-length');
    if (contentLength) {
      resHeaders.set('Content-Length', contentLength);
    }

    return new NextResponse(upstreamRes.body as any, {
      status: upstreamRes.status === 206 ? 206 : 200,
      headers: resHeaders,
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
