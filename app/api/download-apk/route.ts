import { NextResponse } from 'next/server';

export async function GET() {
  // If user builds APK or pushes to GitHub releases:
  const releaseDownloadUrl = 'https://github.com/ianfrds/playtify/releases';

  return NextResponse.redirect(releaseDownloadUrl, 307);
}
