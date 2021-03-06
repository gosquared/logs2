import { CloudWatchLogs, AWSError } from "aws-sdk";
import { Message, MessageData, Settings } from "../types";
import { retry } from "./save";
import cuid from 'cuid';
import { create as createLogStream } from './logStream';
import events from './events';

type SequenceToken = string;

class LoggerError extends Error {
  e?: Error;
}
class SaveError extends LoggerError {}
class LogStreamError extends LoggerError {}
class DroppedError extends LoggerError {
  messages?: Message[];
}

export default class Logger {
  cw: CloudWatchLogs;
  logGroup: string;
  logStream?: string;
  settings?: Settings;
  messages: Message[] = [];
  token?: SequenceToken;
  timeout?: any;
  interval?: number = 5000;
  limit = 10000;

  constructor(cw: CloudWatchLogs, logGroup: string, settings?: Settings) {
    this.cw = cw;
    this.logGroup = logGroup;
    this.settings = settings;

    if (settings?.interval) this.interval = settings?.interval;
  }

  log(text: string, data: MessageData) {
    this.addMessage({ text, data, timestamp: new Date() });
  }

  addMessage(message: Message) {
    const length = this.messages.push(message);
    if (length < this.limit) return;
    const messages = this.messages;
    this.messages = [];
    const err = new DroppedError('message limit reached');
    err.messages = messages;
    events.emit('error', err);
  }

  async save() {
    if (this.timeout) clearTimeout(this.timeout);
    if (this.messages.length === 0) {
      this.schedule();
      return;
    }

    let logStream;
    try {
      logStream = await this.getLogStream();
    } catch (e) {
      const err = new LogStreamError('could not create log stream');
      err.e = e;
      events.emit('error', err);
      this.schedule();
      return;
    }

    const messages = this.messages;
    this.messages = [];

    try {
      this.token = await retry(this.cw, this.logGroup, logStream, messages, this.token);
      events.emit('save', messages);
    } catch(e) {
      const err = new SaveError('error saving log messages');
      err.e = e;
      events.emit('error', err);
    }

    this.schedule();
  }

  schedule() {
    this.timeout = setTimeout(() => this.save(), this.interval);
  }

  async getLogStream() {
    if (this.logStream) return this.logStream;

    // check if log stream exists by trying to create it
    let name = this.settings?.logStream || cuid();
    let err: AWSError | undefined;
    try {
      await createLogStream(this.cw, this.logGroup, name);
    } catch(e) {
      err = e;
    }

    // exist error is ok, but throw if any other error
    if (err && err.code != 'ResourceAlreadyExistsException') {
      throw err;
    }

    this.logStream = name;
    return name;
  }

  start() {
    this.schedule();
  }

  async stop() {
    await this.save();
    clearTimeout(this.timeout);
  }
}
