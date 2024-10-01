<?js

$CLIENT_CONFIG={
  connectionString: process.env.POSTGRES_URL,
}

$POOL_CONFIG={
  ...$CLIENT_CONFIG,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
}
