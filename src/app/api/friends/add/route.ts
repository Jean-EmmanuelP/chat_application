import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { addFriendValidator } from "@/lib/validations/add-friend"
import { getServerSession } from "next-auth"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const { email: emailToAdd } = addFriendValidator.parse(body.email)
        console.log(`get id`, emailToAdd)

        const idToAdd = await fetchRedis('get', `user:email:${emailToAdd}`) as string
        if (!idToAdd) {
            return new Response('This person does not exist.', {status: 400})
        }
        
        const session = await getServerSession(authOptions)

        if (!session) {
            return new Response('Unauthorized', {status: 401})
        }

        if (idToAdd === session.user.id)
        {
            return new Response('You cannot add yourself as friends', {status:400})
        }
    
    // valid request
    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id)

    return new Response('OK')
    // console.log(data)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(`Invalid request`, {status: 400})
        }
    }
}