// Drizzle migrations import .sql files, which babel-plugin-inline-import
// turns into strings at build time.
declare module "*.sql" {
    const sql: string;
    export default sql;
}
