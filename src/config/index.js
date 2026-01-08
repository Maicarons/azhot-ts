import dotenv from 'dotenv';
dotenv.config();
export const config = {
    server: {
        host: process.env.SERVER_HOST || 'localhost',
        port: parseInt(process.env.SERVER_PORT || '8080', 10),
    },
    database: {
        type: process.env.DB_TYPE || 'sqlite',
        mysqlDsn: process.env.MYSQL_DSN,
    },
    mcp: {
        stdioEnabled: process.env.MCP_STDIO_ENABLED === 'true',
        httpEnabled: process.env.MCP_HTTP_ENABLED === 'true',
        port: parseInt(process.env.MCP_PORT || '8081', 10),
    },
    debug: process.env.DEBUG === 'true',
    cors: {
        origins: process.env.CORS_ALLOW_ORIGINS?.split(',') || [],
    },
};
