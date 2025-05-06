
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiUrl = process.env.NEXT_PUBLIC_API;

    if (!apiUrl) {
      return NextResponse.json(
        { message: 'API configuration error' },
        { status: 500 }
      );
    }
    
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const res = await fetch(`${apiUrl}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
        name: body.name,
        role: 'user' // Explicitly set default role
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMessage = data?.errors?.[0]?.message || 'Registration failed';
      console.error('Registration error:', errorMessage);
      return NextResponse.json(
        { message: errorMessage },
        { status: res.status }
      );
    }

    return NextResponse.json({ message: 'Registration successful', user: data });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Registration service temporarily unavailable' },
      { status: 503 }
    );
  }
}
