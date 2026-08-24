import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    // Später kommt hier Supabase rein
    console.log(email, password);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl">

        <h1 className="text-5xl font-bold text-violet-400 text-center mb-10">
  MoveMate
</h1>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full rounded-xl bg-zinc-800 border border-zinc-700 p-4 text-white outline-none focus:border-violet-500"
          />

          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full rounded-xl bg-zinc-800 border border-zinc-700 p-4 text-white outline-none focus:border-violet-500"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-violet-600 py-4 font-semibold text-white transition hover:bg-violet-500"
          >
            Anmelden
          </button>

        </form>

      </div>
    </div>
  );
}