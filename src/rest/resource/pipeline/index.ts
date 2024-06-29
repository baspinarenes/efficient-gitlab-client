import { request } from "undici";
import {
  MappedPipelineVariable,
  MappedProjectPipeline,
  MappedPipeline,
  PipelineGetLatestProps,
  PipelineGetListProps,
  PipelineGetPipelineProps,
  PipelineGetVariablesProps,
  PipelineOrderByType,
  PipelineSortType,
  PipelineVariable,
  ProjectPipeline,
  Pipeline,
} from "../../../../types/resource/pipeline.ts";
import config from "../../../config.ts";

export class GitlabPipelineClient {
  private static instance: GitlabPipelineClient;
  private configs: {
    token: string;
    host?: string;
    apiUrl?: string;
  };
  private gitlabHeaders = {};

  constructor({ token, host }: { token: string; host?: string }) {
    this.configs = {
      token,
      host: host || config.defaultHost,
    };

    this.gitlabHeaders = {
      "PRIVATE-TOKEN": this.configs.token,
    };
  }

  public static getInstance({
    token,
    host,
  }: {
    token: string;
    host?: string;
  }): GitlabPipelineClient {
    if (!GitlabPipelineClient.instance) {
      GitlabPipelineClient.instance = new GitlabPipelineClient({ token, host });
    }

    return GitlabPipelineClient.instance;
  }

  get list() {
    return {
      project: this.getProjectPipelines.bind(this),
    };
  }

  get get() {
    return {
      single: this.getPipeline.bind(this),
      latest: this.getLatest.bind(this),
      variables: this.getVariables.bind(this),
      testReport: this.getTestReport.bind(this),
      testReportSummary: this.getTestReportSummary.bind(this),
    };
  }

  public async create() {} // TODO: Implement

  public async retry() {} // TODO: Implement

  public async cancel() {} // TODO: Implement

  public async delete() {} // TODO: Implement

  get update() {
    return {
      metadata: this.updateMetadata.bind(this),
    };
  } // TODO: Implement

  get map() {
    return {
      projectPipeline: this.mapProjectPipeline.bind(this),
      pipeline: this.mapPipeline.bind(this),
      variable: this.mapVariable.bind(this),
    };
  }

  private async updateMetadata() {}

  private async getTestReport() {} // TODO: Implement

  private async getTestReportSummary() {} // TODO: Implement

  private async getProjectPipelines({
    projectId,
    mapper = this.map.projectPipeline,
    pagination = {
      page: 1,
      perPage: 20,
    },
    order = {
      by: PipelineOrderByType.UPDATED_AT,
      sort: PipelineSortType.DESC,
    },
    filter = {},
  }: PipelineGetListProps): Promise<MappedProjectPipeline[]> {
    const { statusCode, body } = await request(
      `${this.configs.host}/${config.apiPath}/projects/${projectId}/pipelines`,
      {
        headers: this.gitlabHeaders,
        query: {
          ...{
            ...pagination,
            per_page: pagination.perPage,
          },
          ...{
            ...order,
            order_by: order.by,
          },
          ...{
            ...filter,
            updated_after: filter.updatedAfter,
            updated_before: filter.updatedBefore,
            yaml_errors: filter.yamlErrors,
          },
        },
      }
    );

    if (statusCode !== 200) throw new Error("Failed to fetch data");

    const result = (await body.json()) as ProjectPipeline[];
    return result.map(mapper);
  }

  private async getPipeline({
    projectId,
    pipelineId,
    mapper = this.map.pipeline,
  }: PipelineGetPipelineProps): Promise<MappedPipeline> {
    const { statusCode, body } = await request(
      `${this.configs.host}/${config.apiPath}/projects/${projectId}/pipelines/${pipelineId}`,
      {
        headers: this.gitlabHeaders,
      }
    );

    if (statusCode !== 200) throw new Error("Failed to fetch data");

    const result = (await body.json()) as Pipeline;
    return mapper(result);
  }

  private async getLatest({
    projectId,
    mapper = this.map.pipeline,
  }: PipelineGetLatestProps): Promise<MappedPipeline> {
    const { statusCode, body } = await request(
      `${this.configs.host}/${config.apiPath}/projects/${projectId}/pipelines/latest`,
      {
        headers: this.gitlabHeaders,
      }
    );

    if (statusCode !== 200) throw new Error("Failed to fetch data");

    const result = (await body.json()) as Pipeline;
    return mapper(result);
  }

  private async getVariables({
    projectId,
    pipelineId,
    mapper = this.map.variable,
  }: PipelineGetVariablesProps): Promise<MappedPipelineVariable[]> {
    const { statusCode, body } = await request(
      `${this.configs.host}/${config.apiPath}/projects/${projectId}/pipelines/${pipelineId}/variables`,
      {
        headers: this.gitlabHeaders,
      }
    );

    if (statusCode !== 200) throw new Error("Failed to fetch data");

    const result = (await body.json()) as PipelineVariable[];
    return result.map(mapper);
  }

  private mapProjectPipeline(pipeline: ProjectPipeline): MappedProjectPipeline {
    return {
      id: pipeline.id,
      iid: pipeline.iid,
      projectId: pipeline.project_id,
      webUrl: pipeline.web_url,
      ref: pipeline.ref,
      sha: pipeline.sha,
      source: pipeline.source,
      status: pipeline.status,
      createdAt: new Date(pipeline.created_at),
      updatedAt: new Date(pipeline.updated_at),
    };
  }

  private mapPipeline(pipeline: Pipeline): MappedPipeline {
    return {
      id: pipeline.id,
      iid: pipeline.iid,
      projectId: pipeline.project_id,
      name: pipeline.name,
      sha: pipeline.sha,
      ref: pipeline.ref,
      status: pipeline.status,
      source: pipeline.source,
      createdAt: new Date(pipeline.created_at),
      updatedAt: new Date(pipeline.updated_at),
      webUrl: pipeline.web_url,
      beforeSha:
        pipeline.before_sha === "0000000000000000000000000000000000000000"
          ? undefined
          : pipeline.before_sha,
      tag: pipeline.tag,
      yamlErrors: pipeline.yaml_errors ?? undefined,
      user: {
        id: pipeline.user.id,
        username: pipeline.user.username,
        name: pipeline.user.name,
        state: pipeline.user.state,
        avatarUrl: pipeline.user.avatar_url,
        webUrl: pipeline.user.web_url,
      },
      startedAt: new Date(pipeline.started_at),
      finishedAt: new Date(pipeline.finished_at),
      committedAt: pipeline.committed_at
        ? new Date(pipeline.committed_at)
        : undefined,
      duration: pipeline.duration,
      queuedDuration: pipeline.queued_duration,
      coverage: pipeline.coverage,
      detailedStatus: {
        icon: pipeline.detailed_status.icon,
        text: pipeline.detailed_status.text,
        label: pipeline.detailed_status.label,
        group: pipeline.detailed_status.group,
        tooltip: pipeline.detailed_status.tooltip,
        hasDetails: pipeline.detailed_status.has_details,
      },
    };
  }

  private mapVariable(variable: PipelineVariable): MappedPipelineVariable {
    return {
      key: variable.key,
      value: variable.value,
      variableType: variable.variable_type,
    };
  }
}
