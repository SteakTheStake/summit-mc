
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  const response = await fetch(`https://api.modrinth.com/v2/search?query=${query}`);
  const data = await response.json();
  
  return NextResponse.json(data);
}
