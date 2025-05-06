
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  const response = await fetch(`https://api.curseforge.com/v1/mods/search?gameId=432&searchFilter=${query}`, {
    headers: {
      'x-api-key': process.env.CURSEFORGE_API_KEY!
    }
  });
  const data = await response.json();
  
  return NextResponse.json(data);
}
