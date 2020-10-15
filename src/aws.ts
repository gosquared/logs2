import AWS, { Config, CloudWatchLogs } from 'aws-sdk';

let logs: CloudWatchLogs;

export function get(config?: Config) {
  if (logs) return logs;
  logs = new AWS.CloudWatchLogs(config);
  return logs
}
