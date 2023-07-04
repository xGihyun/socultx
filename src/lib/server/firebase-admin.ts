import admin from 'firebase-admin'
import { FIREBASE_ADMIN_SDK_KEY } from '$env/static/private';
import type { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

const initializeFirebase = () => {
    if (!admin.apps.length) {
        const serviceAccount = JSON.parse(FIREBASE_ADMIN_SDK_KEY);

        // Parse the `private_key` properly - https://github.com/gladly-team/next-firebase-auth/discussions/95
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/gm, "\n");

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
};

export async function decodeToken(token: string): Promise<DecodedIdToken | null> {
    if (!token) {
        return null;
    }

    try {
        initializeFirebase();

        return await admin.auth().verifyIdToken(token);
    } catch (err) {
        console.error('An error occurred validating token', (err as Error).message);
        return null;
    }
}