import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const filename = file.name || `upload-${Date.now()}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadsDir = path.join(process.cwd(), "uploads");
    await fs.promises.mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, filename);
    await fs.promises.writeFile(filePath, buffer);

    return NextResponse.json({ ok: true, filename });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
