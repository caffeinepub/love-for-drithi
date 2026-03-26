# Love for Drithi

## Current State
The app has cloud sync implemented via ICP backend, but several critical bugs prevent reliable cross-device sync:

1. **Photos stored by label (not ID)**: `actor.addPhoto(targetItem.label, ...)` — if a label is renamed, future lookups (`actor.getPhoto(newLabel)`) fail to find the photo stored under the old label.
2. **MusicPlayer does not load from cloud on mount**: It only reads `localStorage`, so a new device never gets the uploaded music unless page is refreshed after localStorage is populated.
3. **Gallery loading sequence is wrong**: Photos are fetched by (stale) label before cloud metadata is applied, causing mismatch.
4. **`saveGallery` only writes to localStorage** (not cloud), though `updateGallery` does call `saveAppContent`. The sequence is correct but relies on `actorRef.current` being set.

## Requested Changes (Diff)

### Add
- MusicPlayer: useEffect to load music from cloud via `actor` when actor becomes available, setting `audioSrc` directly.

### Modify
- All `actor.addPhoto(label, blob)` calls → use `String(item.id)` as the key.
- All `actor.getPhoto(label)` calls → use `String(item.id)` as the key.
- Gallery cloud loading sequence: load `getAppContent()` first to get correct metadata (labels, IDs), update gallery state, THEN load photos by ID.
- `handleAddFile`: use `String(newId)` as the photo storage key instead of `label`.
- Remove localStorage fallback for music display; always prefer cloud URL.

### Remove
- Nothing removed.

## Implementation Plan
1. Fix `handleReplaceFile`: use `String(targetId)` as photo key.
2. Fix `handleAddFile`: use `String(newId)` as photo key.
3. Fix main cloud load useEffect: load `getAppContent()` first, apply gallery metadata, then fetch photos by `String(item.id)`.
4. Fix MusicPlayer component: add useEffect to load music track from cloud when actor is ready, call `setAudioSrc(url)`.
5. Validate and deploy.
