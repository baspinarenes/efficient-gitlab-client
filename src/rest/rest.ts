import config from "../config";
import { GitlabJobClient } from "./resource/job";
import { GitlabPipelineClient } from "./resource/pipeline";

export class GitlabClient {
  private configs: {
    token: string;
    host?: string;
  };

  constructor({ token, host }: { token: string; host?: string }) {
    this.configs = {
      token,
      host: host || config.defaultHost,
    };

    new GitlabPipelineClient(this.configs);
  }

  get pipeline() {
    return GitlabPipelineClient.getInstance(this.configs);
  }

  get job() {
    return GitlabJobClient.getInstance(this.configs);
  }
}
