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
