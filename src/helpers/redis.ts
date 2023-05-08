const upstashRedisRestUrl = process.env.NEXTAUTH_URL
const authToken = process.env.TOKEN

type Command = 'zrange' | 'sismember' | 'get' | 'smembers'

export async function fetchRedis(
    command: Command,
    ...args: (string | number)[]
) {
    const commandUrl = `${upstashRedisRestUrl}/${command}/${args.join('/')}`
}