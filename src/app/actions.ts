"use server";

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export type FormState = {
    message: string;
    error?: boolean;
}

export async function switchUser(userId: string) {
    cookies().set('currentUser_id', userId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    redirect('/dashboard');
}

export async function logout() {
    cookies().delete('currentUser_id');
    redirect('/');
}
