export interface MessageData {};

export interface Message {
  text: string;
  data: MessageData;
  timestamp: Date;
}
