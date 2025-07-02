import { runCronJob } from "./utils/runCronJob";

// api/run-cron.js
export default async function handler(req, res) {
  try {
    // Your scraping + DB logic here
    await runCronJob();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
