---
name: commit-pr
description: >-
  Ship a change through Git: create a well-named branch (with the Linear ticket
  when there is one), split work into clean Conventional Commits, push, and
  open a concise pull request. Use whenever the user wants to commit, stage,
  branch, push, or open/prepare a PR, e.g. "commit this", "fais une PR",
  "ouvre/prépare la PR", "push my work". Trigger even for a single step (just a
  commit, just a branch).
---

# Commit and PR

Turn a working-tree change into Git history that still reads well six months
from now, and a PR a reviewer can grasp in fifteen seconds.

The default is end to end and autonomous: branch, commits, push, PR, with no
approval stop between steps. Pause only at the forks listed at the end.
Autonomy stops at anything destructive: never rewrite or discard shared
history, so no force-push, no `--amend` on a pushed commit, no interactive
rebase, no `git reset --hard`, no branch deletion.

Scope yourself to what was asked: "just commit this" means commit, with no push
and no PR. The one exception is branching off `main`, a safety guard that
always applies (step 2): a scoped "just commit" on `main` still branches first,
then stops before push and PR.

## 1. Read the situation first

```bash
git status
git diff            # unstaged
git diff --cached   # staged
git branch --show-current
git log --oneline -10
```

Look at the content, not only the file names: you cannot group commits or
write a real "why" without knowing what the diff does. Read surrounding files
when the code is unfamiliar.

## 2. Branch

- On `main`: always branch before committing.
- On an auto-generated session branch (`claude/*`) with nothing meaningful
  committed yet: create a properly named branch instead.
- Already on a descriptive feature branch for this work: stay on it.
- A PR is already open for the current branch: keep the branch; new commits
  land on the existing PR.

Naming: `<type>/<ticket>-<kebab-summary>`, all lowercase. `type` is the
Conventional Commit type of the main change; `<ticket>` is the Linear ticket
lowercased (`aut-293`), omitted when there is none (step 3); then a 3-6 word
summary of the work rather than of the implementation.

```text
feat/aut-293-data-alerts-sales-report
chore/migrate-secrets-to-doppler              # no ticket
```

Create it from an up-to-date base (`git switch -c <name>`; fetch first if
`main` is stale). `git branch -m` may rename a branch, never one already pushed
with an open PR. More examples in `references/conventions.md`.

## 3. Linear ticket (deduce, don't nag)

Tickets look like `AUT-NNN`. Scan the user's message and the current branch
name for one. If the user named a ticket without its number, or you have a
plausible match, confirm through the Linear MCP tools (`ToolSearch` for
`linear`) and pull the title: it sharpens the branch summary and the PR
context. When found, use it in the branch name and add `Closes AUT-NNN` to the
PR body. When none is implied, proceed without one; ask only when it is unclear
whether the work belongs to a specific ticket.

## 4. Commit: small, meaningful, conventional

Avoid both failure modes: one giant commit dumping everything, and one coherent
change shattered into noise. A reviewer reading the commits in sequence should
follow a story.

How to split: group the diff by intent, one commit per group.

- Separate a refactor (no behavior change) from the feature or fix riding on
  it.
- Separate unrelated fixes or concerns that happen to share the tree.
- Separate mechanical or config churn (deps bump, generated files, formatting,
  migrations) from hand-written logic.
- Keep tests with the code they cover, in the same commit, unless they stand
  alone (for example adding tests to existing code).

Stage per group with explicit paths (`git add <paths>`, then commit). Prefer
file-level grouping; split within a file only when hunks are clearly
unrelated. Do not over-split: two trivial lines serving one idea are one
commit, and one truly atomic change is one commit.

Message format, per [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```text
<type>(<scope>): <summary>
```

- Subject of about 60 characters at most, imperative mood, lowercase start, no
  trailing period. Describe the effect rather than the files touched.
- Scope is the affected project or domain. It is optional but used heavily
  here; include it when there is an obvious one.
- Body: usually skip. Add a short one (wrapped at about 72 columns) only when
  the why is not obvious from the subject: a non-trivial decision, a
  constraint, a gotcha. Never restate what the diff shows.
- Commit messages and PR text are in English.

See `references/conventions.md` for the type and scope cheatsheet and worked
commit examples.

## 5. Push

```bash
git push -u origin <branch>
```

If the upstream already exists, a plain `git push` is fine. Never force-push:
a non-fast-forward rejection means someone else's work is on the branch, so
stop and tell the user instead of reaching for `--force`.

## 6. Open the PR

Title: Conventional Commit subject shape (`type(scope): summary`); it becomes
the squash-merge subject.

Body: two sections, nothing more unless it earns its place. The diff shows the
line by line; the description gives the why and a map of the how.

```markdown
## Context

<2-3 sentences: the functional or technical problem, the why.>

## Implementation

- <key change at the intent level>
- <another, only if it adds signal>

Closes AUT-NNN
```

- Context answers "why does this PR exist?": the business need or the bug.
- Implementation is a short bulleted map at the intent level (3-5 bullets for
  most PRs), not a per-file changelog.
- Drop `Closes AUT-NNN` when there is no ticket.
- Add a Tests or Notes section only when a reviewer needs it (a manual test
  step, a follow-up, a risk). No empty ceremony such as "## Screenshots" or a
  checklist.

Before creating the PR, run the drafted title and body through the `no-ai-slop`
skill (`/no-ai-slop`). It returns the final text to
this step. Put that text verbatim into the
`gh pr create` heredoc, in the same turn. The rewrite is never the end of the
task. Do the same before updating an existing PR's description with
`gh pr edit`.

Create it with `gh pr create`, passing the body through a heredoc; passed
inline, the newlines and markdown collapse. A worked invocation is in
[references/pr-template.md](references/pr-template.md).

Once it is open, report back. That final message is read by someone who did
not watch the run, so state what landed (branch, commits, PR URL) rather than
narrating the steps.

## When to pause and ask

End to end does not mean guessing through real forks. Stop, ask, and end the
turn on the question only when:

- The diff clearly mixes two unrelated efforts and you cannot tell whether the
  user wants one PR or two branches (a scope decision).
- You cannot tell which Linear ticket the work belongs to and it plausibly
  matters (input only the user has).
- The base branch looks wrong, for example branching off another feature
  branch instead of `main` (input only the user has).

Everything else (branch name, commit split, message wording, PR copy) is yours
to decide.
