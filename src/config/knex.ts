const knexConfig = {
    client: 'mysql',
    connection: {
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database,
        port: process.env.port,
    },
    pool: { min: 0, max: 30 },
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const knexInstance = require('knex')(knexConfig);