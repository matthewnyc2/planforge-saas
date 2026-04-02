# Contract: PlanForge SaaS Audit & Fix

## Audit Findings

### REAL (working) behavior
- NextAuth credentials auth with bcrypt hash + Prisma lookup: **REAL**
- User registration with bcrypt + Prisma insert: **REAL**
- Project CREATE/READ via Prisma SQLite: **REAL**
- Task CRUD (create, read, update status, delete): **REAL**
- Dashboard stats computed from Prisma data: **REAL**
- Settings profile update (name, email) via /api/user PATCH: **REAL**
- Settings password change with current-password verification: **REAL**
- Drag-and-drop task reordering (HTML5 drag API → PATCH): **REAL**
- Middleware-guarded /dashboard routes: **REAL**

### FAKE / INCOMPLETE behavior (to fix)

| # | File | Issue | Fix |
|---|------|-------|-----|
| 1 | `.env` | Duplicate `DATABASE_URL` (orphaned `file:./dev.db`) | Remove duplicate |
| 2 | `api/projects/[projectId]/route.ts` | PATCH/DELETE have no ownership check – any authenticated user can edit or delete any project | Add `ownerId` check |
| 3 | `api/projects/[projectId]/tasks/[taskId]/route.ts` | Task PATCH/DELETE have no project-ownership guard | Add ownership check via project lookup |
| 4 | `settings/page.tsx` – Notifications | Checkboxes use `defaultChecked` with zero persistence; look functional but save nothing | Replace with `localStorage`-backed state |
| 5 | `settings/page.tsx` – Appearance | Theme buttons apply no class/style; dark-mode CSS doesn't exist in the project | Remove section (dark mode not implemented) |
| 6 | `page.tsx` – Landing | "Now in Public Beta" implies a real deployed product | Remove badge |
| 7 | `page.tsx` – Landing | "Join thousands of teams already using PlanForge" is a false claim | Replace with honest copy |

### External integrations NOT present
- Stripe: no keys, no webhook, no payment logic → no claim made in code (only in pricing UI labels)
- Google OAuth: no provider configured → no claim made
- GitHub OAuth: not present → no claim made
- Email/SMTP: not present → no claim made

## Success Criteria
1. Build passes with `node node_modules/next/dist/bin/next build`
2. Each fix is committed to the nested git repo with a message
3. No file introduced by this fix exceeds 100 lines
4. All remaining UI states backed by real or clearly-local (localStorage) persistence

## Constraints
- 1 function per new file
- No new files > 100 lines
- No new abstractions
- No external service mocks introduced
