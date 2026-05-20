import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Tistory RSS feed URL
    const RSS_URL = 'https://chatgpts.kr/rss';
    
    const response = await fetch(RSS_URL, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) throw new Error('Failed to fetch RSS');
    
    const xml = await response.text();
    
    // Simple regex to extract titles and links from RSS XML
    // This avoids needing a heavy XML parser library
    const items = [];
    const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
    
    for (const match of itemMatches) {
      const content = match[1];
      const titleMatch = content.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || content.match(/<title>(.*?)<\/title>/);
      const linkMatch = content.match(/<link>(.*?)<\/link>/);
      
      if (titleMatch && linkMatch) {
        items.push({
          title: titleMatch[1],
          link: linkMatch[1]
        });
      }
      
      if (items.length >= 20) break; // Limit to latest 20 posts
    }
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('RSS Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
