'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function switchUser(userId: string) {
  const cookieStore = await cookies();
  
  // Set the user cookie with the correct name expected by getCurrentUser
  cookieStore.set('currentUser_id', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect('/dashboard');
}
