import { get as getCw } from './src/aws';
import Logger from "./src/logger";
import { AwsConfig } from './types';

interface Settings {
  aws?: AwsConfig
}

const loggers: Map<string, Logger> = new Map();

export function getLogger(logGroup: string, settings: Settings) {
  const CloudwatchLogs = getCw(settings.aws);

  let logger = loggers.get(logGroup);
  if (logger) return logger;

  logger = new Logger(CloudwatchLogs, logGroup);
  loggers.set(logGroup, logger);
  logger.start();
}

export async function stop() {
  for (let [ name, logger ] of loggers) {
    await logger.stop();
  }
}

