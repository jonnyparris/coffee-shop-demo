import { CIWorkflow } from '@repo/ci';
import type { CiParams, CiRunnerStep, WorkflowEvent } from '@repo/ci';

export class CI extends CIWorkflow {
  protected async pipeline(
    event: WorkflowEvent<CiParams>,
    step: CiRunnerStep
  ): Promise<void> {
    const p = event.payload;
    const deps = await step
      .cache(['package-lock.json'])
      .runner('install', { exec: 'npm ci' });

    await Promise.all([
      deps.runner("build", { exec: "npm run 'build'", capture: false }),
      deps.runner("build-storybook", { exec: "npm run 'build-storybook'", capture: false }),
      deps.runner("build:app", { exec: "npm run 'build:app'", capture: false }),
      deps.runner("check", { exec: "npm run 'check'", capture: false }),
      deps.runner("lint", { exec: "npm run 'lint'", capture: false }),
      deps.runner("lint:fix", { exec: "npm run 'lint:fix'", capture: false }),
      deps.runner("typecheck", { exec: "npm run 'typecheck'", capture: false })
    ]);

    const isBranchPush =
      p.trigger === 'push' && !!p.branch && p.branch !== p.defaultBranch;
    if (p.trigger === 'pull_request' || isBranchPush) {
      const previews = await Promise.all([
        deps.build({"worker":"coffee-shop","wrangler":"wrangler.jsonc","packageManager":"npm"}).preview()
      ]);
      const mainPreview = previews.find((preview) => preview.worker === "coffee-shop");
      if (mainPreview) {
        // Non-gating visual regression against the branch preview; the baseline
        // is the default branch. Add more entries to the catalog for other pages.
        await step.delta({
          project: "coffee-shop",
          baselineBranch: p.defaultBranch,
          catalog: [
            { id: 'index', title: 'index', name: 'index', url: mainPreview.url },
          ],
        });
      }
      return;
    }

    if (p.trigger !== 'push' || p.branch !== p.defaultBranch) {
      return;
    }

    await Promise.all([
      deps.build({"worker":"coffee-shop","wrangler":"wrangler.jsonc","packageManager":"npm"}).release()
    ]);
  }
}
