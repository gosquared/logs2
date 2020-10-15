
import { CloudWatchLogs } from "aws-sdk";
import { CreateLogStreamRequest } from "aws-sdk/clients/cloudwatchlogs";

/**
 *
 * @param cw
 * @param group
 * @param stream the stream name
 */
export function create(cw: CloudWatchLogs, group: string, stream: string) {
  const params: CreateLogStreamRequest = {
    logGroupName: group,
    logStreamName: stream
  };
  return cw.createLogStream(params).promise();
}
