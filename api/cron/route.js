// app/api/cron/route.js

import { NextResponse } from "next/server";
import { runCronJob } from "../utils/runCronJob";

export async function GET() {
  try {
    // Your scraping + DB logic here
    await runCronJob();
    console.log("Cron job executed!");

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error executing cron job:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
  // Your scheduled task logic goes here
}
