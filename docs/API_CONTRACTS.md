# API Contracts

Phase 1 uses mock services and does not expose an API. Planned endpoints include `GET/POST /api/decks`, `GET/PATCH/DELETE /api/decks/:id`, `POST /api/generation`, card CRUD, study sessions, reviews, quizzes, statistics, search, and preferences. Future requests will use Zod and return `{data: ...}` or `{error:{code,message,details}}`. See the Phase 0 archive for proposed schemas.