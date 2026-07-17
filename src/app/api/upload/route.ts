import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

type ImgbbResponse = {
  success?: boolean;
  status?: number;
  error?: { message?: string };
  data?: {
    url?: string;
    display_url?: string;
    delete_url?: string;
  };
};

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.IMGBB_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "IMGBB_API_KEY সেট করা নেই — .env-এ ImgBB API key দিন (https://api.imgbb.com/)",
      },
      { status: 500 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "ছবি দিন" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "শুধু ইমেজ ফাইল আপলোড করা যাবে" },
        { status: 400 },
      );
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "ছবি খুব বড় (সর্বোচ্চ ৮MB)" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    const body = new FormData();
    body.append("image", base64);
    body.append("name", file.name.replace(/\.[^.]+$/, "") || "priyojon");

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      { method: "POST", body },
    );

    const json = (await res.json()) as ImgbbResponse;

    if (!res.ok || !json.success) {
      const message =
        json.error?.message ?? "ImgBB আপলোড ব্যর্থ — আবার চেষ্টা করুন";
      console.error("ImgBB upload failed:", json);
      return NextResponse.json({ error: message }, { status: 502 });
    }

    const url = json.data?.display_url || json.data?.url;
    if (!url) {
      return NextResponse.json(
        { error: "ImgBB থেকে ছবির লিংক পাওয়া যায়নি" },
        { status: 502 },
      );
    }

    // Permanent CDN URL — save this in MongoDB
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "ছবি আপলোড ব্যর্থ — আবার চেষ্টা করুন" },
      { status: 500 },
    );
  }
}
