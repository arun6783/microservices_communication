var Redis = require('redis')
class RedisClient {
  constructor() {
    this.connected = false
    this.client = null
  }
  async getConnection() {
    if (this.connected) return this.client
    else {
      this.client = Redis.createClient({
        url: `redis://${process.env.AGGREGATION_REDIS_HOST}:6379`,
      })

      this.client.on('error', (err) => {
        console.log(
          'Error occured while connecting or accessing redis server-onerr',
          err
        )
      })

      this.client.on('ready', () => {
        console.log('✅ 💃 redis have ready !')
      })

      this.client.on('connect', () => {
        console.log('✅ 💃 connect redis success !')
        this.connected = true
      })

      await this.client.connect()

      return this.client
    }
  }
  async set(key, val) {
    let redis_client = await this.getConnection()
    await redis_client.set(key, JSON.stringify(val))
  }

  async get(key) {
    let redis_client = await this.getConnection()
    const val = await redis_client.get(key)
    if (val) {
      return JSON.parse(val)
    }
    return undefined
  }
}

module.exports = new RedisClient()
