// app/api/cron/route.js

import { NextResponse } from "next/server";

export async function GET() {
  // Your scheduled task logic goes here
  console.log("Cron job executed!");

  return NextResponse.json({ ok: true });
}
