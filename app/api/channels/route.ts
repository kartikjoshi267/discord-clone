import { v4 as uuid } from "uuid";
import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { name, type } = await req.json();
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get('serverId');

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type
          }
        }
      }
    })

    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNELS POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}