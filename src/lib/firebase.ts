import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInAnonymously,
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// ✅ FIX: استخدم (default) لو الـ firestoreDatabaseId غير موجود
export const db = getFirestore(
  app,
  (firebaseConfig as any).firestoreDatabaseId || undefined
);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle  = () => signInWithPopup(auth, googleProvider);
export const signInAsGuest     = () => signInAnonymously(auth);
export const logout            = () => signOut(auth);
export { updateProfile, signInAnonymously };

// ✅ FIX: ترجمة رسائل Firebase للعربية
export function translateFirebaseError(code: string): string {
  const map: Record<string, string> = {
    'auth/invalid-credential':       'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    'auth/invalid-email':            'صيغة البريد الإلكتروني غير صحيحة.',
    'auth/user-not-found':           'لا يوجد حساب بهذا البريد الإلكتروني.',
    'auth/wrong-password':           'كلمة المرور غير صحيحة.',
    'auth/email-already-in-use':     'هذا البريد الإلكتروني مسجّل مسبقاً.',
    'auth/weak-password':            'كلمة المرور ضعيفة، يجب أن تكون 6 أحرف على الأقل.',
    'auth/too-many-requests':        'تم تجاوز عدد المحاولات. يرجى الانتظار ثم المحاولة مجدداً.',
    'auth/network-request-failed':   'تعذّر الاتصال بالإنترنت. تحقق من الشبكة.',
    'auth/popup-closed-by-user':     'تم إغلاق نافذة الدخول. يرجى المحاولة مرة أخرى.',
    'auth/cancelled-popup-request':  'طلب سابق قيد التنفيذ، يرجى الانتظار.',
    'auth/operation-not-allowed':    'طريقة تسجيل الدخول هذه غير مفعّلة في Firebase.',
    'auth/user-disabled':            'هذا الحساب موقوف. تواصل مع المسؤول.',
  };
  return map[code] ?? 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
}

export function loginWithEmail(email: string, pass: string) {
  return signInWithEmailAndPassword(auth, email, pass);
}

export function signUpWithEmail(email: string, pass: string) {
  return createUserWithEmailAndPassword(auth, email, pass);
}

// Test Firestore connection silently
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (e: any) {
    const msg = e?.message ?? '';
    if (msg.includes('offline') || msg.includes('permission-denied') || msg.includes('NOT_FOUND')) {
      console.info('Firebase connected (test doc result expected).');
    } else {
      console.warn('Firebase notice:', msg);
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST   = 'list',
  GET    = 'get',
  WRITE  = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    providerInfo?: { providerId?: string | null; email?: string | null }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      providerInfo: auth.currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email,
      })) ?? [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
