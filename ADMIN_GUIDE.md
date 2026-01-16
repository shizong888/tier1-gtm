# Admin Dashboard Guide

## Overview

The admin dashboard provides real-time collaborative markdown editing powered by Convex. Multiple users can edit documents simultaneously with live sync and pending changes tracking.

## Features

- **Real-time Collaboration**: See when others are editing documents
- **Auto-save Pending Changes**: Changes sync to Convex every 500ms while you type
- **Save & Publish**: Click "Save" to publish changes to the live site
- **Live Preview**: See rendered markdown as you edit
- **Document Management**: Create, edit, and organize GTM strategy documents

## Getting Started

### 1. Access the Admin Dashboard

Navigate to: `http://localhost:3000/admin`

### 2. Migrate Existing Markdown Files

First, you need to populate Convex with your existing markdown documents. The migration script extracts all documents from `docs/gtm-content/` and prepares them for import.

```bash
# Generate migration data
npx tsx scripts/migrate-to-convex.ts > migration-data.json
```

This creates a JSON file with all your documents. To import them to Convex:

**Option A: Using Convex Dashboard**
1. Go to https://dashboard.convex.dev
2. Select your project: `tier1-gtm`
3. Navigate to Functions → Run Function
4. Select `migrate:seedDocuments`
5. Paste the `documents` array from `migration-data.json`
6. Click "Run"

**Option B: Using Convex CLI**
```bash
npx convex run migrate:seedDocuments --arg '{"documents": [...]}'
```

### 3. Start Editing

1. Visit `/admin` to see all documents
2. Click any document to edit it
3. Make changes in the markdown editor
4. Changes auto-sync as "pending" every 500ms
5. Click "Save" to publish changes to the live site

## How Real-Time Collaboration Works

### Pending Changes
- As you type, changes are saved as "pending" in Convex
- Other users see how many people are editing a document
- Each user's pending changes are tracked separately

### Publishing Changes
- Click "Save" to publish your changes
- This updates the main document and clears all pending changes
- Published content appears on the live site immediately

### Conflict Resolution
- Last save wins (simple conflict resolution)
- See active editors before saving to avoid conflicts
- Future: Could add real-time merge strategies

## Architecture

### Schema
```
documents
  - slug: string
  - title: string
  - content: string (markdown)
  - order: number
  - updatedAt: number
  - updatedBy: string

pendingChanges
  - documentId: Id<documents>
  - userId: string
  - content: string
  - lastUpdated: number
```

### Key Files
- `convex/schema.ts` - Database schema
- `convex/documents.ts` - CRUD operations and mutations
- `src/app/admin/page.tsx` - Document list dashboard
- `src/app/admin/edit/[id]/page.tsx` - Real-time editor
- `src/components/providers/convex-client-provider.tsx` - Convex React integration

## Development

### Start Dev Server
```bash
npm run dev

# In a separate terminal, start Convex sync
npx convex dev
```

### Environment Variables
- `NEXT_PUBLIC_CONVEX_URL` - Your Convex deployment URL
- `CONVEX_DEPLOYMENT` - Convex deployment name

These are already configured in `.env.local`

## Next Steps

1. **Migration**: Run the migration script to import existing markdown
2. **Test Editing**: Open `/admin` in two browser windows and test real-time sync
3. **Customize UI**: Add more features like document deletion, reordering, etc.
4. **Integration**: Update public pages to read from Convex instead of file system

## Notes

- Admin routes (`/admin/*`) are excluded from password protection middleware
- The editor uses a simple HTML preview - you can enhance this with a proper markdown renderer
- Auto-save debounce is set to 500ms - adjust in `edit/[id]/page.tsx` if needed
