# Lovable Bidirectional Sync Configuration

## Overview
This repository is configured for bidirectional synchronization with Lovable.

### Project Details
- **GitHub Repository**: saqibakhlaq7/legaldraft-pro-tanstack
- **Lovable Project ID**: 94e323f7-cd81-4356-b811-0134650372ae
- **Lovable Project URL**: https://lovable.dev/projects/94e323f7-cd81-4356-b811-0134650372ae

## Sync Workflow

### Automatic Sync
- **Trigger**: Every 30 minutes (scheduled)
- **On Push**: Syncs when code is pushed to `main` or `lovable-sync` branches
- **Manual**: Can be triggered via GitHub Actions workflow_dispatch

### Sync Direction
- **GitHub → Lovable**: Code changes pushed to GitHub are synced to Lovable
- **Lovable → GitHub**: Changes made in Lovable are pulled back to GitHub
- **Bidirectional**: Both directions (default)

## Setup Instructions

### 1. Add Lovable API Key (Optional but Recommended)
For full bidirectional sync capability, add your Lovable API key:

1. Go to your Lovable project settings
2. Generate an API token
3. Add it as a GitHub Secret:
   - Go to: Settings → Secrets and variables → Actions
   - Create new secret: `LOVABLE_API_KEY`
   - Paste your Lovable API token

### 2. Configure Sync Settings
Edit `.github/workflows/lovable-sync.yml` to customize:
- Sync frequency (currently every 30 minutes)
- Branches to sync
- Files/folders to exclude

### 3. Monitor Sync Status
- Check GitHub Actions: `.github/workflows/lovable-sync.yml`
- Review commits with message prefix `🔄 Sync with Lovable`
- Check for any sync conflicts

## Files Included in Sync
- `src/` - Source code
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `vite.config.ts` - Vite configuration

## Excluded from Sync
- `node_modules/`
- `.git/`
- `dist/`
- `.env` files (keep local)

## Troubleshooting

### Sync Not Working?
1. Check GitHub Actions logs
2. Verify Lovable API key is set (if using)
3. Ensure no conflicting branches exist
4. Check commit history for error messages

### Merge Conflicts?
If conflicts arise during sync:
1. GitHub Actions will pause the sync
2. Manually resolve in the `lovable-sync` branch
3. Create a PR to merge resolved changes to `main`

### Disable Sync Temporarily
Comment out the schedule in `.github/workflows/lovable-sync.yml`:
```yaml
# - cron: '*/30 * * * *'
```

## Re-enable Sync
Uncomment the schedule line in `.github/workflows/lovable-sync.yml`

## Related Documentation
- [Lovable Docs](https://lovable.dev)
- [GitHub Actions Documentation](https://docs.github.com/actions)

---
**Last Updated**: 2026-05-19
**Status**: ✅ Active
