# PR body: worked example

The body must reach `gh` through a heredoc; passed inline, the newlines collapse and the
markdown renders as one paragraph.

```bash
gh pr create --title "fix(lawyer-fee-notes): don't crash after creating the fee notes" --body "$(cat <<'EOF'
## Context
The payment run created all 34 fee notes, then exited 1 on its own closing
log line: the `created` key collides with a LogRecord attribute.

## Implementation
- Rename the colliding log key so the closing line renders
- A run that did its work now exits 0

Closes AUT-188
EOF
)"
```

Note the quoted `<<'EOF'`: unquoted, the shell would expand backticks and `$` inside the body.
