"use client";

import Image from "next/image";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isSignedIn, signIn } from "@/lib/auth";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useToast } from "@/components/Toast";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  // auto login redirect if session exists
  useEffect(() => {
    if (isSignedIn()) router.replace("/dashboard");
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await signIn({ email, password });

      toast.success("Signed in", 2500);
      router.push("/dashboard");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Login failed";
      setError(msg);
      toast.danger(msg, 3000);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.center}>
        <div className={styles.logoWrap} aria-hidden="true">
          <Image src="/logo.svg" alt="" width={75} height={75} priority />
        </div>

        <h1 className={styles.title}>Sign in to your account</h1>

        <form className={styles.form} onSubmit={onSubmit}>
          <span className={styles.labelText}>Username</span>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />

          <div className={styles.passwordRow}>
            <span className={styles.labelText}>Password</span>
            <a className={styles.forgot} href="#">
              Forgot password?
            </a>
          </div>

          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && <p className={styles.errorText}>{error}</p>}

          <Button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </section>
    </main>
  );
}
