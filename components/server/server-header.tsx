"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  LogOutIcon,
  PlusCircle,
  SettingsIcon,
  TrashIcon,
  UserPlus,
  Users,
} from "lucide-react";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator =
    role === MemberRole.MODERATOR || role === MemberRole.ADMIN;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-100 space-y-[2px]">
        {isModerator && (
          <DropdownMenuItem onClick={() => onOpen("invite", { server })} className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer flex justify-between items-center dark:hover:bg-zinc-900 hover:bg-zinc-100 duration-150">
            Invite People
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem onClick={() => onOpen("editServer", { server })} className="px-3 py-2 text-sm cursor-pointer flex justify-between items-center dark:hover:bg-zinc-900 hover:bg-zinc-100 duration-150">
            Server Settings
            <SettingsIcon className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem onClick={() => onOpen("members", { server })} className="px-3 py-2 text-sm cursor-pointer flex justify-between items-center dark:hover:bg-zinc-900 hover:bg-zinc-100 duration-150">
            Manage Members
            <Users className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer flex justify-between items-center dark:hover:bg-zinc-900 hover:bg-zinc-100 duration-150" onClick={() => onOpen("createChannel", { server })}>
            Create Channel
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem className="text-rose-500 px-3 py-2 text-sm cursor-pointer flex justify-between items-center dark:hover:bg-zinc-900 hover:bg-zinc-100 duration-150" onClick={() => onOpen("deleteServer", { server })}>
            Delete Server
            <TrashIcon className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem className="text-rose-500 px-3 py-2 text-sm cursor-pointer flex justify-between items-center dark:hover:bg-zinc-900 hover:bg-zinc-100 duration-150" onClick={() => onOpen("leaveServer", { server })}>
            Leave Server
            <LogOutIcon className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
