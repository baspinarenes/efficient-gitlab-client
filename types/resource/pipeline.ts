import { UserState } from "../common";

export interface ProjectPipeline {
  id: number;
  iid: number;
  project_id: number;
  sha: string;
  ref: string;
  status: PipelineStatus;
  source: PipelineSource;
  created_at: string;
  updated_at: string;
  web_url: string;
}

export interface MappedProjectPipeline {
  id: number;
  iid: number;
  projectId: number;
  sha: string;
  ref: string;
  status: PipelineStatus;
  source: PipelineSource;
  createdAt: Date;
  updatedAt: Date;
  webUrl: string;
}

export interface Pipeline {
  id: number;
  iid: number;
  project_id: number;
  name: string;
  sha: string;
  ref: string;
  status: PipelineStatus;
  source: PipelineSource;
  created_at: string;
  updated_at: string;
  web_url: string;
  before_sha: string;
  tag: boolean;
  yaml_errors: unknown | null; // TODO: FILL THIS
  user: {
    id: number;
    username: string;
    name: string;
    state: UserState;
    avatar_url: string;
    web_url: string;
  };
  started_at: string;
  finished_at: string;
  committed_at: string | null;
  duration: number;
  queued_duration: number;
  coverage: unknown | null; // TODO: FILL THIS
  detailed_status: {
    icon: unknown; // TODO: FILL THIS. (status_success)
    text: unknown; // TODO: FILL THIS. (passed)
    label: unknown; // TODO: FILL THIS. (passed)
    group: unknown; // TODO: FILL THIS. (sucess)
    tooltip: unknown; // TODO: FILL THIS. (passed)
    has_details: boolean;
    details_path: string;
    illustration: string | null;
    favicon: string;
  };
}

export interface MappedPipeline {
  id: number;
  iid: number;
  projectId: number;
  name: string;
  sha: string;
  ref: string;
  status: PipelineStatus;
  source: PipelineSource;
  createdAt: Date;
  updatedAt: Date;
  webUrl: string;
  beforeSha?: string;
  tag: boolean;
  yamlErrors: unknown | null; // TODO: FILL THIS
  user: {
    id: number;
    username: string;
    name: string;
    state: UserState;
    avatarUrl: string;
    webUrl: string;
  };
  startedAt: Date;
  finishedAt: Date;
  committedAt?: Date;
  duration: number;
  queuedDuration: number;
  coverage: unknown | null; // TODO: FILL THIS
  detailedStatus: {
    icon: unknown; // TODO: FILL THIS. (status_success)
    text: unknown; // TODO: FILL THIS. (passed)
    label: unknown; // TODO: FILL THIS. (passed)
    group: unknown; // TODO: FILL THIS. (sucess)
    tooltip: unknown; // TODO: FILL THIS. (passed)
    hasDetails: boolean;
  };
}

export interface PipelineVariable {
  key: string;
  variable_type?: string;
  value: string;
}

export interface MappedPipelineVariable {
  key: string;
  variableType?: string;
  value: string;
}

export enum PipelineOrderByType {
  ID = "id",
  STATUS = "status",
  REF = "ref",
  UPDATED_AT = "updated_at",
  USER_ID = "user_id",
}

export enum PipelineScopeType {
  RUNNING = "running",
  PENDING = "pending",
  FINISHED = "finished",
  BRANCHES = "branches",
  TAGS = "tags",
}

export enum PipelineStatus {
  CREATED = "created",
  WAITING_FOR_RESOURCE = "waiting_for_resource",
  PREPARING = "preparing",
  PENDING = "pending",
  RUNNING = "running",
  SUCCESS = "success",
  FAILED = "failed",
  CANCELED = "canceled",
  SKIPPED = "skipped",
  MANUAL = "manual",
  SCHEDULED = "scheduled",
}

export enum PipelineSortType {
  ASC = "asc",
  DESC = "desc",
}

export enum PipelineSource {
  CHAT = "chat",
  EXTERNAL = "external",
  EXTERNAL_PULL_REQUEST_EVENT = "external_pull_request_event",
  MERGE_REQUEST_EVENT = "merge_request_event",
  ONDEMAND_DAST_SCAN = "ondemand_dast_scan",
  ONDEMAND_DAST_VALIDATION = "ondemand_dast_validation",
  PARENT_PIPELINE = "parent_pipeline",
  PIPELINE = "pipeline",
  PUSH = "push",
  SCHEDULE = "schedule",
  SECURITY_ORCHESTRATION_POLICY = "security_orchestration_policy",
  TRIGGER = "trigger",
  WEB = "web",
  WEBIDE = "webide",
}

export interface PipelineGetListProps {
  projectId: number;
  mapper?: (pipeline: ProjectPipeline) => any;
  pagination?: {
    page?: number;
    perPage?: number;
  };
  order?: {
    by?: PipelineOrderByType;
    sort?: PipelineSortType;
  };
  filter?: {
    name?: string;
    ref?: string;
    scope?: PipelineScopeType;
    sha?: string;
    source?: PipelineSource;
    status?: PipelineStatus;
    updatedAfter?: string;
    updatedBefore?: string;
    username?: string;
    yamlErrors?: boolean;
  };
}

export interface PipelineGetPipelineProps {
  projectId: number;
  pipelineId: number;
  mapper?: (pipeline: Pipeline) => any;
}

export interface PipelineGetLatestProps {
  projectId: number;
  mapper?: (pipeline: Pipeline) => any;
}

export interface PipelineGetVariablesProps {
  projectId: number;
  pipelineId: number;
  mapper?: (variable: PipelineVariable) => any;
}
