import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { login } from "../actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await currentUser()) redirect("/cms/");
  const { error } = await searchParams;
  return (
    <main className="min-h-screen flex items-center justify-center p-6"><form action={login} className="card p-8 w-full max-w-sm space-y-4">
      <h1 className="text-[28px]">Sign in</h1>
      {error && <p className="notice notice-copper text-[14px]">{error}</p>}
      <div><label className="label" htmlFor="email">Email</label><input className="field" id="email" name="email" type="email" required autoComplete="username" /></div>
      <div><label className="label" htmlFor="password">Password</label><input className="field" id="password" name="password" type="password" required autoComplete="current-password" /></div>
      <div><label className="label" htmlFor="code">Authenticator code</label><input className="field" id="code" name="code" inputMode="numeric" pattern="[0-9 ]{6,7}" required autoComplete="one-time-code" /></div>
      <button className="btn btn-primary w-full" type="submit">Sign in</button>
    </form></main>
  );
}
