import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, _context: RouteContext) {
  return NextResponse.json(
    { error: "গোপন কোড ছাড়া এই ডেটা দেখা যাবে না" },
    { status: 403 },
  );
}
