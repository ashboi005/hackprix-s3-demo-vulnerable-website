# Git History Secret Leak 

This document serves as a simulation guide of how secret leaks occur within a Git history and how they can be detected and purged.

> [!WARNING]
> **INTENTIONAL VULNERABILITY FOR SECURITY**
> Secrets committed to git history are detectable by security scanners even if they are deleted or modified in subsequent commits.

## Scenario: Accidental Secret Commit

Imagine a developer accidentally commits a production database credential in `backend/db/db.js` and pushes it:

```bash
git add backend/db/db.js
git commit -m "feat: Add database pool with credentials"
```

Realizing the mistake, the developer updates `backend/db/db.js` in a new commit to load the credential from environment variables:

```bash
# Correcting the file, but leaving the secret in git history:
git commit -am "fix: Move database credentials to env variables"
```

Although the secret is no longer in the active working directory, security scanners like **CodeSentinel**, **TruffleHog**, or **GitGuardian** will scan the entire commit history and flag the leak.

---

## Simulation Script

To simulate a historical secret leak in this repository for testing:

1. Add a dummy secret to a temporary file:
   ```bash
   echo "PROD_API_KEY=mv_prod_api_key_leak_9b8a7c6d5e4f" > secret_temp.txt
   git add secret_temp.txt
   git commit -m "temp: save prod credentials"
   ```

2. Remove the file in a new commit:
   ```bash
   git rm secret_temp.txt
   git commit -m "clean: remove temp credentials"
   ```

3. Run your Git secret scanner to observe that the leak is detected in commit history.

---

## Remediation: Purging Git History

To permanently remove the secret from Git history, developers must rewrite the history using tools like `git-filter-repo` or `BFG Repo-Cleaner`.

### Using `git-filter-repo` (Recommended)

1. Install `git-filter-repo` via pip or package manager:
   ```bash
   pip install git-filter-repo
   ```

2. Run `git-filter-repo` to purge any file containing the secret, or replace the secret text:
   ```bash
   git filter-repo --replace-text <(echo "mv_prod_api_key_leak_9b8a7c6d5e4f==>REMOVED_SECRET")
   ```

3. Force-push the rewritten history to your remote repository:
   ```bash
   git push origin --force --all
   ```
