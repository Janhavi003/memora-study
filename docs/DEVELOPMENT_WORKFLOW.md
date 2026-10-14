# Development Workflow

Current branch: `feature/frontend`.

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

Review `git status` and `git diff --cached`; exclude `.env`, local databases, dependencies, and build output. Commit with `git commit -m "feat: implement Memora frontend"` and push with `git push -u origin feature/frontend`. Check the real remote URL before pushing.