export interface Settings {
  aws?: AwsConfig;
  logStream?: string;
  interval?: number; // milliseconds
}

export interface MessageData {};

export interface Message {
  text: string;
  data: MessageData;
  timestamp: Date;
}

export interface AwsConfig {
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  apiVersion: string;
}
