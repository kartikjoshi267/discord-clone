import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { UserButton } from "@clerk/nextjs";

import { redirect } from "next/navigation";

import NavigationAction from "@/components/navigation/navigation-action";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationItem from "@/components/navigation/navigation-item";
import { ModeToggle } from "@/components/mode-toggle";

const NavigationSidebar = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });

  return (
    <div className="space-y-4 flex flex-col items-start h-full text-primary w-full bg-slate-200 dark:bg-[#1e1f22] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4 flex flex-col">
            <NavigationItem {...server} />
          </div>
        ))}
      </ScrollArea>
      <div className="p-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
};

export default NavigationSidebar;
