import { DefaultRollout } from '@repo/hmd';

// Health-mediated deployment: the ci-cd-worker gradually shifts traffic to the
// new version and auto-reverts if health checks regress. Swap the base class
// (DefaultRollout / FastRollout / HotfixRollout) to change cadence.
export class Rollout extends DefaultRollout {}
