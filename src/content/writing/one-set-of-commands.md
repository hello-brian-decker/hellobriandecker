---
title: I Have 25 Side Projects and One Set of Commands
summary: How a single 969-line ops script, byte-identical across 24 repos, keeps a one-person fleet operable, and why that same uniformity makes AI agents actually useful.
date: 2026-09-13
draft: true
---

> **Outline, not the post.** Source material: `/opt/me/writings/opt-platform-research.md`.
> Rule for the final draft: every abstract claim is followed within two sentences by a path, a number, or a command.
> **Keep out of the public version:** hostnames, IPs, job names, and anything describing what's currently broken.

## 1. The four-months-later problem

Open with the pain: you come back to a project you haven't touched in months, and you can't remember how to deploy it, where its backups go, or which script restarts it. Now multiply that by 25.

## 2. The receipt

Show the command before explaining anything:

```bash
$ md5 -q /opt/apps/*/.cicd/ops.sh | sort | uniq -c
  24 ef59dcab591c2c2468b2729fe61a69ea
```

969 lines, identical in 24 repos. Per-project divergence is a small `bindings.sh` (median about 35 lines).

## 3. Why it's possible: the slug is the primary key

- `gNN-<type>-<name>` is the directory name in every `/opt` tree, so every path is a pure function of the slug.
- No lookup table, for humans or for tools.

## 4. Three patterns that hold it up

1. **Tree boundaries by lifecycle.** Disposable artifacts are kept apart from irreplaceable backups, because that split answers "what happens if I lose this?"
2. **A declarative `project.yml`.** No tool has to parse shell to learn about a project.
3. **Generate facts, write intent.** Indexes are generated from disk, docs hold only intent, and when they disagree, the filesystem wins.

## 5. The turn: this is also why agents work

Uniform commands and structured exit codes mean an AI agent can operate any project without special-casing it. Show one concrete example of an agent running the same command across the fleet.

## 6. Where it bites

Be honest about the costs: drift detection, the one project that doesn't fit the pattern, and generated indexes that go stale when their scheduler quietly stops. Keep this general; no live details.

## Figures (4)

- [ ] Directory tree for one slug across the `/opt` trees
- [ ] `ops.sh` vs `bindings.sh` line counts across the fleet
- [ ] The lifecycle split diagram
- [ ] Agent loop: command → exit code → decision
