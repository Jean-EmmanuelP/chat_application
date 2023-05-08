import { db } from "@/lib/db"
import Button from '@/components/ui/Button'
import { getServerSession } from "next-auth"

export default async function Home() {
  return <Button variant='default'>Hello</Button>
}
