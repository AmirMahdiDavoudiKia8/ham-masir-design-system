/**
 * Feedback — transient system-feedback primitives (Spinner, Skeleton) plus
 * ProgressBar. Each lives in its own file; this module only re-exports them
 * so existing `./Feedback` imports keep working.
 */
export { Spinner } from "./Spinner";
export { Skeleton } from "./Skeleton";
export { ProgressBar, type ProgressBarProps } from "./ProgressBar";
