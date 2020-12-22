export interface ConfigInput {
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  apiVersion?: string;
}

export interface Config {
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  apiVersion: string;
}
