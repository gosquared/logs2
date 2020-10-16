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

/**
 * can be called without token, but this requires an extra round trip to
 * get from cwlogs.
 * @param cw
 * @param group
 * @param stream
 * @param messages
 * @param token
 */
export async function retry(cw: CloudWatchLogs, group: string, stream: string, messages: Message[], token?: string): Promise<string | undefined> {
  let attempts = 0;
  let err: AWSError | undefined;
  let result;

  try {
    result = await save(cw, group, stream, messages, token);
  } catch(e) {
    err = e;
  }

  /**
   * From cw logs docs:
   * "You must include the sequence token obtained from the response of
   * the previous call. An upload in a newly created log stream does not
   * require a sequence token. You can also get the sequence token in the
   * expectedSequenceToken field from InvalidSequenceTokenException. If
   * you call PutLogEvents twice within a narrow time period using the same
   * value for sequenceToken, both calls might be successful or one might
   * be rejected."
   * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#putLogEvents-property
   */
  while (err) {
    if (attempts >= 5) {
      const err2 = new RetryError('retry limit reached');
      err2.e = err;
      throw err2;
    }
    // DataAlreadyAcceptedException
    let match = err.message.match(/sequenceToken: (.+)/);
    // InvalidSequenceTokenException
    if (!match) match = err.message.match(/sequenceToken is: (.+)/);
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
