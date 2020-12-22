import { ConfigInput as AwsConfig } from './aws';

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
