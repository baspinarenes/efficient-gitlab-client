import { request } from "undici";
import {
  PipelineOrderByType,
  PipelineSortType,
} from "../../../../types/resource/pipeline.ts";
import {
  Job,
  JobScopeType,
  MappedJob,
  MappedTriggerJob,
  TriggerJob,
} from "../../../../types/resource/job";
import config from "../../../config.ts";

export class GitlabJobClient {
  private static instance: GitlabJobClient;
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
  }): GitlabJobClient {
    if (!GitlabJobClient.instance) {
      GitlabJobClient.instance = new GitlabJobClient({ token, host });
    }

    return GitlabJobClient.instance;
  }

  get list() {
    return {
      project: this.getProjectJobs.bind(this),
      pipeline: this.getPipelineJobs.bind(this),
      trigger: this.getTriggerJobs.bind(this),
    };
  }

  get get() {
    return {
      single: this.getSingle.bind(this),
      log: this.getLog.bind(this),
    };
  }

  public async cancel() {}
  public async retry() {}
  public async erase() {}
  public async run() {}

  // TODO: Scope gibi filterlar birden fazla olabiir: ?scope[]=pending&scope[]=running

  private async getProjectJobs({
    projectId,
    mapper = this.map.job,
    pagination = {
      page: 1,
      perPage: 20,
    },
    order = {
      by: PipelineOrderByType.UPDATED_AT,
      sort: PipelineSortType.DESC,
    },
  }: {
    projectId: number;
    mapper?: (job: Job) => any;
    pagination?: {
      page?: number;
      perPage?: number;
    };
    order?: {
      by: PipelineOrderByType;
      sort: PipelineSortType;
    };
  }): Promise<MappedJob[]> {
    const { statusCode, body } = await request(
      `${this.configs.host}/${config.apiPath}/projects/${projectId}/jobs`,
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
        },
      }
    );

    if (statusCode !== 200) throw new Error("Failed to fetch data");

    const result = (await body.json()) as Job[];
    return result.map(mapper);
  }

  private async getPipelineJobs({
    projectId,
    pipelineId,
    pagination = {
      page: 1,
      perPage: 20,
    },
    order = {
      by: PipelineOrderByType.UPDATED_AT,
      sort: PipelineSortType.DESC,
    },
    filter = {},
    mapper = this.map.job,
  }: {
    projectId: number;
    pipelineId: number;
    mapper?: (job: Job) => any;
    pagination?: {
      page?: number;
      perPage?: number;
    };
    order?: {
      by: PipelineOrderByType;
      sort: PipelineSortType;
    };
    filter?: {
      includeRetried?: boolean;
      scope?: JobScopeType[];
    };
  }): Promise<MappedJob[]> {
    const { statusCode, body } = await request(
      `${this.configs.host}/${config.apiPath}/projects/${projectId}/pipelines/${pipelineId}/jobs`,
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
            include_retried: filter.includeRetried,
          },
        },
      }
    );

    if (statusCode !== 200) throw new Error("Failed to fetch data");

    const result = (await body.json()) as Job[];
    return result.map(mapper);
  }

  private async getTriggerJobs({
    projectId,
    pipelineId,
    mapper = this.map.triggerJob,
    pagination = {
      page: 1,
      perPage: 20,
    },
    order = {
      by: PipelineOrderByType.UPDATED_AT,
      sort: PipelineSortType.DESC,
    },
    filter = {},
  }: {
    projectId: number;
    pipelineId: number;
    mapper?: (job: TriggerJob) => any;
    pagination?: {
      page?: number;
      perPage?: number;
    };
    order?: {
      by: PipelineOrderByType;
      sort: PipelineSortType;
    };
    filter?: {
      scope?: JobScopeType[];
    };
  }): Promise<MappedTriggerJob[]> {
    const { statusCode, body } = await request(
      `${this.configs.host}/${config.apiPath}/projects/${projectId}/pipelines/${pipelineId}/bridges`,
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
          ...filter,
        },
      }
    );

    if (statusCode !== 200) throw new Error("Failed to fetch data");

    const result = (await body.json()) as TriggerJob[];
    return result.map(mapper);
  }

  private async getSingle({
    projectId,
    jobId,
    mapper = this.map.job,
  }: {
    projectId: number;
    jobId: number;
    mapper?: (job: Job) => any;
  }): Promise<MappedJob> {
    const { statusCode, body } = await request(
      `${this.configs.host}/${config.apiPath}/projects/${projectId}/jobs/${jobId}`
    );

    if (statusCode !== 200) throw new Error("Failed to fetch data");

    const result = (await body.json()) as Job;
    return mapper(result);
  }

  private async getLog() {}

  get map() {
    return {
      job: this.mapJob.bind(this),
      triggerJob: this.mapTriggerJob.bind(this),
    };
  }

  mapTriggerJob(job: TriggerJob): MappedTriggerJob {
    return {
      allowFailure: job.allow_failure,
      artifacts: job.artifacts,
      artifactsExpireAt: new Date(job.artifacts_expire_at),
      artifactsFile: job.artifacts_file,
      tagList: job.tag_list,
      runner: job.runner
        ? {
            active: job.runner.active,
            description: job.runner.description,
            id: job.runner.id,
            ipAddress: job.runner.ip_address,
            isShared: job.runner.is_shared,
            name: job.runner.name ?? undefined,
            online: job.runner.online,
            paused: job.runner.paused,
            runnerType: job.runner.runner_type,
            status: job.runner.status,
          }
        : undefined,
      runnerManager: job.runner_manager
        ? {
            architecture: job.runner_manager.architecture,
            contactedAt: new Date(job.runner_manager.contacted_at),
            createdAt: new Date(job.runner_manager.created_at),
            id: job.runner_manager.id,
            ipAddress: job.runner_manager.ip_address,
            platform: job.runner_manager.platform,
            revision: job.runner_manager.revision,
            systemId: job.runner_manager.system_id,
            version: job.runner_manager.version,
            status: job.runner_manager.status,
          }
        : undefined,
      commit: {
        authorEmail: job.commit.author_email,
        authorName: job.commit.author_name,
        createdAt: new Date(job.commit.created_at),
        id: job.commit.id,
        message: job.commit.message,
        shortId: job.commit.short_id,
        title: job.commit.title,
      },
      createdAt: new Date(job.created_at),
      coverage: job.coverage ?? undefined,
      downstreamPipeline: {
        id: job.downstream_pipeline.id,
        ref: job.downstream_pipeline.ref,
        sha: job.downstream_pipeline.sha,
        status: job.downstream_pipeline.status,
        createdAt: new Date(job.downstream_pipeline.created_at),
        updatedAt: new Date(job.downstream_pipeline.updated_at),
        webUrl: job.downstream_pipeline.web_url,
      },
      duration: job.duration ?? undefined,
      erasedAt: job.erased_at ? new Date(job.erased_at) : undefined,
      failureReason: job.failure_reason,
      finishedAt: new Date(job.finished_at),
      id: job.id,
      name: job.name,
      pipeline: {
        id: job.pipeline.id,
        projectId: job.pipeline.project_id,
        ref: job.pipeline.ref,
        sha: job.pipeline.sha,
        status: job.pipeline.status,
      },
      project: {
        ciJobTokenScopeEnabled: job.project.ci_job_token_scope_enabled,
      },
      ref: job.ref,
      stage: job.stage,
      startedAt: new Date(job.started_at),
      status: job.status,
      tag: job.tag,
      user: {
        avatarUrl: job.user.avatar_url,
        bio: job.user.bio ?? undefined,
        createdAt: new Date(job.user.created_at),
        id: job.user.id,
        linkedin: job.user.linkedin,
        location: job.user.location ?? undefined,
        name: job.user.name,
        organization: job.user.organization,
        publicEmail: job.user.public_email,
        skype: job.user.skype,
        state: job.user.state,
        twitter: job.user.twitter,
        username: job.user.username,
        websiteUrl: job.user.website_url,
        webUrl: job.user.web_url,
      },
      webUrl: job.web_url,
      queuedDuration: job.queued_duration ?? undefined,
    };
  }

  mapJob(job: Job): MappedJob {
    return {
      allowFailure: job.allow_failure,
      artifacts: job.artifacts,
      artifactsExpireAt: new Date(job.artifacts_expire_at),
      artifactsFile: job.artifacts_file,
      commit: {
        authorEmail: job.commit.author_email,
        authorName: job.commit.author_name,
        createdAt: new Date(job.commit.created_at),
        id: job.commit.id,
        message: job.commit.message,
        shortId: job.commit.short_id,
        title: job.commit.title,
      },
      coverage: job.coverage ?? undefined,
      createdAt: new Date(job.created_at),
      duration: job.duration ?? undefined,
      erasedAt: job.erased_at ? new Date(job.erased_at) : undefined,
      failureReason: job.failure_reason,
      finishedAt: new Date(job.finished_at),
      id: job.id,
      name: job.name,
      pipeline: {
        id: job.pipeline.id,
        projectId: job.pipeline.project_id,
        ref: job.pipeline.ref,
        sha: job.pipeline.sha,
        status: job.pipeline.status,
      },
      project: {
        ciJobTokenScopeEnabled: job.project.ci_job_token_scope_enabled,
      },
      queuedDuration: job.queued_duration ?? undefined,
      ref: job.ref,
      runner: job.runner
        ? {
            active: job.runner.active,
            description: job.runner.description,
            id: job.runner.id,
            isShared: job.runner.is_shared,
            name: job.runner.name ?? undefined,
            online: job.runner.online,
            status: job.runner.status,
            ipAddress: job.runner.ip_address,
            paused: job.runner.paused,
            runnerType: job.runner.runner_type,
          }
        : undefined,
      runnerManager: job.runner_manager
        ? {
            architecture: job.runner_manager.architecture,
            contactedAt: new Date(job.runner_manager.contacted_at),
            createdAt: new Date(job.runner_manager.created_at),
            id: job.runner_manager.id,
            ipAddress: job.runner_manager.ip_address,
            platform: job.runner_manager.platform,
            revision: job.runner_manager.revision,
            systemId: job.runner_manager.system_id,
            version: job.runner_manager.version,
            status: job.runner_manager.status,
          }
        : undefined,
      stage: job.stage,
      startedAt: new Date(job.started_at),
      status: job.status,
      tag: job.tag,
      tagList: job.tag_list,
      user: {
        avatarUrl: job.user.avatar_url,
        bio: job.user.bio ?? undefined,
        createdAt: new Date(job.user.created_at),
        id: job.user.id,
        linkedin: job.user.linkedin,
        location: job.user.location ?? undefined,
        name: job.user.name,
        organization: job.user.organization,
        publicEmail: job.user.public_email,
        skype: job.user.skype,
        state: job.user.state,
        twitter: job.user.twitter,
        username: job.user.username,
        websiteUrl: job.user.website_url,
        webUrl: job.user.web_url,
      },
      webUrl: job.web_url,
    };
  }
}
