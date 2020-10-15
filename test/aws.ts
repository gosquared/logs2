const env = process.env;
const region = env.AWS_REGION || 'us-east-1';
const accessKeyId = env.AWS_ACCESS_KEY;
const secretAccessKey = env.AWS_SECRET_ACCESS_KEY;

import { CloudWatchLogs } from 'aws-sdk';
export const cw = new CloudWatchLogs({
  region,
  accessKeyId,
  secretAccessKey
});
