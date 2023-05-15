import { FC } from "react";
import Button from "@/components/ui/Button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { chatHrefConstructor } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const page = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);

  const friendsWithLastMessage = await (await Promise.all(
    friends.map(async (friend) => {
      if (!friend)
        return null; // Add this line

      const lastMessageRaw = (
        await fetchRedis(
          "zrange",
          `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
          -1,
          -1
        )
      )[0];

      let lastMessage;

      if (lastMessageRaw !== undefined) {
        lastMessage = JSON.parse(lastMessageRaw) as Message;
      } else {
        lastMessage = null; // or some other default value
      }

      return {
        ...friend,
        lastMessage,
      };
    })
  )).filter(friend => friend !== null);  // Filter out null friends

  // rest of the code
};

export default page;
