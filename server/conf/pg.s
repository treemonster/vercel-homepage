<?js

$USE_POOL=!__IS_DEV__

$CLIENT_CONFIG={
  connectionString: process.env.POSTGRES_URL || (_=>{
    const p=require('os').homedir()+'/.vercel-myblog-psql.txt'
    return require('fs').readFileSync(p, 'utf8')
  })(),
}

$POOL_CONFIG={
  ...$CLIENT_CONFIG,
  max: 20,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
}
