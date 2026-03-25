# Love for Drithi

## Current State
The app has a Memories Gallery with 5 static photo slots hardcoded in App.tsx. Photos can only be changed by the developer. There is no in-app photo management.

## Requested Changes (Diff)

### Add
- An "Edit Gallery" mode (accessible via a secret/admin button) that lets the user:
  - Upload new photos to gallery slots
  - Remove photos from gallery slots
  - Gallery state stored in backend (Motoko)
- Blob storage for photo uploads
- Authorization so only the owner can edit
- Gallery metadata stored in backend (photo URLs + labels)

### Modify
- Memories Gallery section: load photos from backend instead of static array
- Gallery slots become dynamic (backed by backend state)
- Keep the 5 existing uploaded photos as initial seed data

### Remove
- Nothing removed

## Implementation Plan
1. Select blob-storage and authorization components
2. Generate Motoko backend:
   - Store gallery items (id, label, blobId, bg)
   - Admin can add/remove/reorder photos
   - Initialize with existing 5 photos as static URLs (already uploaded)
3. Frontend:
   - Load gallery from backend on mount
   - Add/Edit mode toggle (admin only after login)
   - In edit mode: show upload buttons on each slot, remove button, add new slot
   - Upload photo via blob-storage, get URL, save to backend
