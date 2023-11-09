"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import ActionTooltip from "@/components/action-tooltip";

interface NavigationItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

const NavigationItem = ({ id, name, imageUrl }: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <div className="w-full">
      <ActionTooltip label={name} side="right" align="center">
        <button
          onClick={() => {
            router.push(`/servers/${id}`);
          }}
          className="relative group flex items-center"
        >
          <div
            className={cn(
              "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
              params?.serverId !== id && "group-hover:h-[20px]",
              params?.serverId === id ? "h-[36px]" : "h-[8px]"
            )}
          />

          <div
            className={cn(
              "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
              params?.serverId === id &&
                "bg-primary/10 text-primary rounded-[16px]"
            )}
          >
            <Image src={imageUrl} alt={name} width={48} height={48} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationItem;
