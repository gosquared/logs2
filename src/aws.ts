import AWS, { CloudWatchLogs } from 'aws-sdk';
import { AwsConfig } from '../types';

const apiVersion = '2014-03-28';

let logs: CloudWatchLogs;

export function get(config?: AwsConfig) {
  if (logs) return logs;
  if (config) config.apiVersion = apiVersion;
  else config = { apiVersion };
  logs = new AWS.CloudWatchLogs(config);
  return logs
}
