import {
  Artifact,
  ArtifactsFile,
  FailureReason,
  RunnerStatus,
  RunnerType,
} from "../common";
import { UserState } from "../common";
import { PipelineStatus } from "./pipeline";

export enum JobStatus {
  PENDING = "pending",
  RUNNING = "running",
  SUCCESS = "success",
  FAILED = "failed",
}

export enum JobScopeType {
  CREATED = "created",
  PENDING = "pending",
  RUNNING = "running",
  FAILED = "failed",
  SUCCESS = "success",
  CANCELED = "canceled",
  SKIPPED = "skipped",
  WAITING_FOR_RESOURCE = "waiting_for_resource",
  MANUAL = "manual",
}

export interface JobCommit {
  author_email: string;
  author_name: string;
  created_at: string;
  id: string;
  message: string;
  short_id: string;
  title: string;
}

export interface JobPipeline {
  id: number;
  project_id: number;
  ref: string;
  sha: string;
  status: PipelineStatus;
}

export interface JobRunner {
  id: number;
  description: string;
  ip_address: string;
  active: boolean;
  paused: boolean;
  is_shared: boolean;
  runner_type: RunnerType;
  name: string | null;
  online: boolean;
  status: RunnerStatus;
}

export interface JobRunnerManager {
  id: number;
  system_id: string;
  version: string;
  revision: string;
  platform: string;
  architecture: string;
  created_at: string;
  contacted_at: string;
  ip_address: string;
  status?: RunnerStatus;
}

export interface JobUser {
  id: number;
  name: string;
  username: string;
  state: UserState;
  avatar_url: string;
  web_url: string;
  created_at: string;
  bio: string | null; // TODO: Add type
  location: string | null; // TODO: Add type
  public_email: string;
  skype: string;
  linkedin: string;
  twitter: string;
  website_url: string;
  organization: string;
}

export interface Job {
  commit: JobCommit;
  coverage: unknown | null; // TODO: Add coverage type
  archived: boolean;
  allow_failure: boolean;
  created_at: string;
  started_at: string;
  finished_at: string;
  erased_at: string | null;
  duration: number | null;
  queued_duration: number | null;
  artifacts_file: ArtifactsFile;
  artifacts: Artifact[];
  artifacts_expire_at: string;
  tag_list: string[];
  id: number;
  name: string;
  pipeline: JobPipeline;
  ref: string;
  runner: JobRunner | null;
  runner_manager: JobRunnerManager | null;
  stage: string;
  status: JobStatus;
  failure_reason: FailureReason;
  tag: boolean;
  web_url: string;
  project: {
    ci_job_token_scope_enabled: boolean;
  };
  user: JobUser;
}

export interface DownstreamPipeline {
  id: number;
  sha: string;
  ref: string;
  status: PipelineStatus;
  created_at: string;
  updated_at: string;
  web_url: string;
}

export interface TriggerJob extends Job {
  downstream_pipeline: DownstreamPipeline;
}

// ====

export interface MappedJobCommit {
  authorEmail: string;
  authorName: string;
  createdAt: Date;
  id: string;
  message: string;
  shortId: string;
  title: string;
}

export interface MappedJobPipeline {
  id: number;
  projectId: number;
  ref: string;
  sha: string;
  status: PipelineStatus;
}

export interface MappedJobRunner {
  id: number;
  description: string;
  ipAddress: string;
  active: boolean;
  paused: boolean;
  isShared: boolean;
  runnerType: RunnerType;
  name: string | undefined;
  online: boolean;
  status: RunnerStatus;
}

export interface MappedJobRunnerManager {
  id: number;
  systemId: string;
  version: string;
  revision: string;
  platform: string;
  architecture: string;
  createdAt: Date;
  contactedAt: Date;
  ipAddress: string;
  status?: RunnerStatus;
}

export interface MappedJobUser {
  id: number;
  name: string;
  username: string;
  state: UserState;
  avatarUrl: string;
  webUrl: string;
  createdAt: Date;
  bio: string | undefined; // TODO: Add type
  location: string | undefined; // TODO: Add type
  publicEmail: string;
  skype: string;
  linkedin: string;
  twitter: string;
  websiteUrl: string;
  organization: string;
}

export interface MappedJob {
  commit: MappedJobCommit;
  coverage: unknown | undefined; // TODO: Add coverage type
  allowFailure: boolean;
  createdAt: Date;
  startedAt: Date;
  finishedAt: Date;
  erasedAt: Date | undefined;
  duration?: number;
  queuedDuration?: number;
  artifactsFile: ArtifactsFile;
  artifacts: Artifact[];
  artifactsExpireAt: Date;
  tagList: string[];
  id: number;
  name: string;
  pipeline: MappedJobPipeline;
  ref: string;
  runner?: MappedJobRunner;
  runnerManager?: MappedJobRunnerManager;
  stage: string;
  status: JobStatus;
  failureReason: FailureReason;
  tag: boolean;
  webUrl: string;
  project: {
    ciJobTokenScopeEnabled: boolean;
  };
  user: MappedJobUser;
}

export interface MappedDownstreamPipeline {
  id: number;
  sha: string;
  ref: string;
  status: PipelineStatus;
  createdAt: Date;
  updatedAt: Date;
  webUrl: string;
}

export interface MappedTriggerJob extends MappedJob {
  downstreamPipeline: MappedDownstreamPipeline;
}
