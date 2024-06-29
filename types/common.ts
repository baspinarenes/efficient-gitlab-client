export enum UserState {
  ACTIVE = "active",
  BLOCKED = "blocked",
}

export enum ArtifactFileFormatType {
  ZIP = "zip",
  GZIP = "gzip",
  RAW = "raw",
}

export enum ArtifactFileType {
  ARCHIVE = "archive",
  METADATA = "metadata",
  TRACE = "trace",
  JUNIT = "junit",
}

export enum RunnerType {
  INSTANCE_TYPE = "instance_type",
  GROUP_TYPE = "group_type",
  PROJECT_TYPE = "project_type",
}

export enum RunnerStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  STALE = "stale",
  NEVER_CONTACTED = "never_contacted",
  ACTIVE = "active",
  PAUSED = "paused",
}

export enum FailureReason {
  ALWAYS = "always",
  UNKNOWN_FAILURE = "unknown_failure",
  SCRIPT_FAILURE = "script_failure",
  API_FAILURE = "api_failure",
  STUCK_OR_TIMEOUT_FAILURE = "stuck_or_timeout_failure",
  RUNNER_SYSTEM_FAILURE = "runner_system_failure",
  RUNNER_UNSUPPORTED = "runner_unsupported",
  STALE_SCHEDULE = "stale_schedule",
  JOB_EXECUTION_TIMEOUT = "job_execution_timeout",
  ARCHIVED_FAILURE = "archived_failure",
  UNMET_PREREQUISITES = "unmet_prerequisites",
  SCHEDULER_FAILURE = "scheduler_failure",
  DATA_INTEGRITY_FAILURE = "data_integrity_failure",
}

export interface Artifact {
  file_type: ArtifactFileType;
  size: number;
  filename: string;
  file_format: ArtifactFileFormatType;
}

export interface ArtifactsFile {
  filename: string;
  size: number;
}
