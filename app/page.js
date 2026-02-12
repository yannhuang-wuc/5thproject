"use client";

import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return setMessage("Select a file first.");
    setMessage("Uploading...");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) setMessage("Uploaded: " + data.filename);
    else setMessage(data.error || "Upload failed");
  }

  return (
    <main style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Audio Upload (Gmail login)</h1>

      {!session && (
        <div>
          <p>You are not signed in.</p>
          <button onClick={() => signIn('google')}>Sign in with Google</button>
        </div>
      )}

      {session && (
        <div>
          <p>Signed in as {session.user?.email}</p>
          <button onClick={() => signOut()}>Sign out</button>

          <form onSubmit={handleUpload} style={{ marginTop: 20 }}>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div style={{ marginTop: 10 }}>
              <button type="submit">Upload</button>
            </div>
          </form>

          {message && <p style={{ marginTop: 10 }}>{message}</p>}
        </div>
      )}

      <footer style={{ marginTop: 40, fontSize: 12, color: '#666' }}>
        This is a local dummy app. Fill `.env.local` with Google OAuth keys.
      </footer>
    </main>
  );
}
