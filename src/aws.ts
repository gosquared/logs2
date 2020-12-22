import AWS, { CloudWatchLogs } from 'aws-sdk';
import { ConfigInput, Config } from '../types/aws';

const apiVersion = '2014-03-28';

let logs: CloudWatchLogs;

export function get(config: ConfigInput = {}) {
  if (logs) return logs;
  // don't modify original config object in case it's used globally
  // across many services
  const _config: Config = { ...config, apiVersion };
  logs = new AWS.CloudWatchLogs(_config);
  return logs
}
