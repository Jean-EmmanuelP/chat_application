const upstashRedisRestUrl = process.env.URL
const authToken = process.env.TOKEN

type Command = 'zrange' | 'sismember' | 'get' | 'smembers'

export async function fetchRedis(
    command: Command,
    ...args: (string | number)[]
) {
    const commandUrl = `${upstashRedisRestUrl}/${command}/${args.join('/')}`
    
    const response = await fetch(commandUrl, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        cache: 'no-store',
      })
    
      if (!response.ok) {
        throw new Error(`Error executing Redis command: ${response.statusText}`)
      }
    
      const data = await response.json()
      return data.result
}