"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ActionTooltip from "@/components/action-tooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: (
    <Hash className="h-4 w-4 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
  ),
  [ChannelType.AUDIO]: (
    <Mic className="h-4 w-4 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
  ),
  [ChannelType.VIDEO]: (
    <Video className="h-4 w-4 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
  ),
};

const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const params = useParams();
  const { onOpen } = useModal();

  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
  }

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { server, channel });
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      {iconMap[channel.type]}
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="group-hover:flex hidden ml-auto items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={(e) => onAction(e, "editChannel")}
              className="line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition w-4 h-4"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={(e) => onAction(e, "deleteChannel")}
              className="line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition w-4 h-4"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <ActionTooltip label="Locked">
          <Lock className="ml-auto line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition w-4 h-4" />
        </ActionTooltip>
      )}
    </button>
  );
};

export default ServerChannel;
