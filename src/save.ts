import { Message } from "../types";
import { CloudWatchLogs, AWSError } from "aws-sdk";
import { PutLogEventsRequest, InputLogEvents } from "aws-sdk/clients/cloudwatchlogs";

class RetryError extends Error {
  e?: Error
};

export function save(
  cw: CloudWatchLogs,
  group: string,
  stream: string,
  messages: Message[],
  token?: string
) {
  const events: InputLogEvents = [];
  for (let message of messages) {
    const { text, data, timestamp } = message;
    const event = {
      message: JSON.stringify({ text, data }),
      timestamp: +timestamp
    }
    events.push(event);
  };
  const params: PutLogEventsRequest = {
    logGroupName: group,
    logStreamName: stream,
    logEvents: events,
    sequenceToken: token
  }
  return cw.putLogEvents(params).promise();
}

export async function retry(cw: CloudWatchLogs, group: string, stream: string, messages: Message[], token?: string): Promise<string | undefined> {
  let attempts = 0;
  let err: AWSError | undefined;
  let result;

  try {
    result = await save(cw, group, stream, messages, token);
  } catch(e) {
    err = e;
  }

  while (err) {
    if (attempts >= 5) {
      const err2 = new RetryError('retry limit reached');
      err2.e = err;
      throw err2;
    }
    const match = err.message.match(/sequenceToken: (.+)/);
    if (!match) throw err;
    token = match[1];
    try {
      result = await save(cw, group, stream, messages, token);
      err = undefined;
    } catch(e) {
      err = e;
      await wait(1000);
    }
    attempts += 1;
  }

  return result?.nextSequenceToken;
}

export function wait(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
