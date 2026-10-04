# Conventions cheatsheet

Drawn from this repo's history. Use it as a guide rather than a closed list, and match what
the codebase already does. This is a monorepo of independent Python automation projects
(mostly services, plus one shared library); each project directory is a natural commit scope.

## Commit types

| Type       | Use for                                                        |
|------------|----------------------------------------------------------------|
| `feat`     | A user- or API-visible new capability                          |
| `fix`      | A bug fix                                                       |
| `refactor` | Restructuring with no behavior change                          |
| `chore`    | Maintenance, deps, tooling, generated files                    |
| `ci`       | GitHub Actions / pipeline changes                              |
| `docs`     | Documentation only (including skills and agent files)          |
| `test`     | Adding or fixing tests in isolation                            |
| `perf`     | Performance improvement                                        |
| `build`    | Build system, Docker images, lint/format tooling               |
| `style`    | Formatting only, no code meaning change                        |

## Scopes seen in this repo

Project scopes: one per project directory, and the scope is the directory name. The full set is
every directory carrying its own `pyproject.toml`:

```bash
find . -maxdepth 3 -name pyproject.toml -not -path "*/.venv/*" \
  | sed 's|/pyproject.toml||; s|^\./||' | sort
```

Three are not a literal directory name:

- `automation-common`: the shared library sits at `packages/automation-common`, but the scope
  drops the `packages/` prefix.
- `sdr-call-training`: use `sdr-call-training-backend` or `-frontend` when only one side is
  touched.
- `youtrust-planhat-sync`: eight older commits say `yousign-planhat-sync`. The project was
  renamed, so do not copy that scope back out of `git log`.

Cross-cutting and tooling scopes: `ci`, `workflows` (deploy workflows), `doppler` (secrets),
`lint`, `mise` (toolchain), `config`, `skills` (`.agents/skills` and the `.claude` symlink that
exposes it), `claude` (`.claude/` agents, rules, hooks and settings).

Pick the scope a reviewer would search by, almost always the affected project. Omit the scope
only when the change is cross-cutting and no single area dominates: a repo-wide dependency
refresh or a root tooling change is the usual case.

## Commit examples (real subjects from this repo)

```text
fix(lawyer-fee-notes): don't crash after creating the fee notes
fix(tag-front): load knowledge base from GCS at startup
fix(workflows): use Doppler CLI action in deployment workflows
feat(doppler): migrate secrets to Doppler and remove local .env files
build(lint): set up lefthook pre-commit hooks
```

The subjects describe the effect ("load knowledge base at startup") rather than the mechanics
("edit main.py and add a call"). Imperative mood, lowercase start, no trailing period.

### When a body helps

Most commits need no body. Add one when the reasoning is not self-evident:

```text
fix(lawyer-fee-notes): don't crash after creating the fee notes

The run did all of its work, then raised on its own closing log line:
`created` collides with a LogRecord attribute. Rename the key so a run
that succeeded exits 0.
```

## Splitting worked example

Say the working tree has: a report runner moved into a package beside the code both reports
share (pure refactor), the second report itself, and a bumped `uv.lock`.

Three commits, in dependency order:

```text
1. refactor(data-alerts): a reports package with a shared base
2. feat(data-alerts): the sales report on the HubSpot meeting rules
3. chore(data-alerts): update uv lockfile
```

The reviewer skims the mechanical move first, then reads the feature in isolation, then
ignores the lockfile. One combined commit would force them to separate all three at once.

## Branch naming examples

`<type>/<aut-ticket>-<kebab-summary>`, all lowercase, `aut-NNN` when there is a Linear ticket
and omitted otherwise:

```text
feat/aut-293-data-alerts-sales-report
fix/aut-188-tag-front-gcs-startup-load
chore/migrate-secrets-to-doppler        # no ticket
refactor/round-robin-dispatch-cleanup   # no ticket
```

Lowercase kebab throughout; the ticket is lowercased in the branch (`aut-188`) even though it
is `AUT-188` in the PR body.

## PR body examples

Minimal, ticketed:

```markdown
## Context

The payment run created all 34 fee notes, then exited 1 on its own closing
log line: the `created` key collides with a LogRecord attribute.

## Implementation

- Rename the colliding log key so the closing line renders
- A run that did its work now exits 0

Closes AUT-188
```

No ticket, with a reviewer note that earns its place:

```markdown
## Context

Secrets lived in per-service `.env` files, which drifted between environments
and couldn't be rotated centrally.

## Implementation

- Migrate all services to Doppler for secret injection
- Remove the local `.env` files from the repo

## Notes

Each service now needs its Doppler token set. Confirm deploys pick up the
secrets before removing the old env vars.
```
