type SignInArgs = {
  email: string;
  password: string;
};

const VALID_EMAIL = "testing@clever.com";
const VALID_PASSWORD = "Clever123";
const SESSION_KEY = "cleverweb.session";

type Session = {
  email: string;
  createdAt: number;
};

function safeGetSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function isSignedIn(): boolean {
  return !!safeGetSession();
}

export function getSession(): Session | null {
  return safeGetSession();
}

export function signOut(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

export async function signIn({ email, password }: SignInArgs): Promise<void> {
  if (!email || !password) throw new Error("Missing credentials");

  await new Promise((r) => setTimeout(r, 150));

  const isValid = email === VALID_EMAIL && password === VALID_PASSWORD;
  if (!isValid) throw new Error("Incorrect login credentials");

  const session: Session = { email, createdAt: Date.now() };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
