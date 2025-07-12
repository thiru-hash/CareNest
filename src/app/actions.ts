"use server";

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export type FormState = {
    message: string;
    error?: boolean;
}

export async function switchUser(userId: string) {
    const cookieStore = await cookies();
    cookieStore.set('currentUser_id', userId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    redirect('/dashboard');
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('currentUser_id');
    redirect('/');
}
