import { NextResponse } from 'next/server';

async function fetchCodaPages(apiKey: string, docId: string) {
  const response = await fetch(`https://coda.io/apis/v1/docs/${docId}/pages`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch pages');
  }

  return response.json();
}

async function exportPageContent(apiKey: string, docId: string, pageId: string) {
  const response = await fetch(
    `https://coda.io/apis/v1/docs/${docId}/pages/${pageId}/content`,
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to export page content');
  }

  return response.json();
}

export async function POST(request: Request) {
  try {
    const { apiKey, docId } = await request.json();

    // Fetch all pages
    const pages = await fetchCodaPages(apiKey, docId);
    
    // Export content for each page
    const exports = await Promise.all(
      pages.items.map(async (page: any) => {
        const content = await exportPageContent(apiKey, docId, page.id);
        return {
          title: page.name,
          content: content.text,
        };
      })
    );

    return NextResponse.json({ success: true, exports });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync content' },
      { status: 500 }
    );
  }
}