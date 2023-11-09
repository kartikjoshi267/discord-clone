"use client"

import { ChannelType, MemberRole } from "@prisma/client";

import { ServerWithMembersWithProfiles } from "@/types";
import ActionTooltip from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server
}: ServerSectionProps) => {
  const { onOpen } = useModal();

  return ( 
    <div
      className="flex items-center justify-between py-2"
    >
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip
          side="top"
          label="Create channel"
        >
          <button onClick={() => onOpen("createChannel", { server: server, channelType: channelType })} className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
            <Plus className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip
        side="top"
        label="Manage Members"
      >
        <button onClick={() => onOpen("members", { server: server })} className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
          <Settings className="w-4 h-4" />
        </button>
      </ActionTooltip>
      )}
    </div>
  );
}
 
export default ServerSection;