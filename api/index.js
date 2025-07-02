import { runCronJob } from "./utils/runCronJob.js";

setInterval(runCronJob, 3 * 60 * 60 * 1000); // Every 3 hours
runCronJob();
