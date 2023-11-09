"use client";

import { Command, Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useParams, useRouter } from "next/navigation";

interface ServerSearchProps {
  data:
    | {
        label: string;
        type: "channel" | "member";
        data:
          | {
              icon: React.ReactNode;
              name: string;
              id: string;
              avatar: string | undefined;
            }[]
          | undefined;
      }[]
    | undefined;
}

const ServerSearch = ({ data }: ServerSearchProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const onClick = ({
    id,
    type,
  }: {
    id: string;
    type: "channel" | "member";
  }) => {
    setOpen(false);

    if (type === "member") {
      return router.push(`/servers/${params?.serverId}/conversations/${id}`);
    }

    if (type === "channel") {
      return router.push(`/servers/${params?.serverId}/channels/${id}`);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group p-2 rounded-md flex items-center gap-x-2 w-full bg-zinc-700/10 dark:bg-zinc-700/70 hover:bg-zinc-700/20 dark:hover:bg-zinc-700/40 transition"
      >
        <Search className="h-4 w-4 mr-2 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
          Search
        </p>
        <kbd className="pointer-events-none flex h-5 select-none justify-center items-center gap-1 rounded-border bg-muted px-1.5 font-mono text-[12px] font-medium text-muted-foreground ml-auto">
          <Command className="h-3 w-3" />
          <div>K</div>
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>No Results Found</CommandEmpty>
          {data?.map(({ label, type, data }) => {
            if (!data?.length) return null;

            if (type === "member") {
              return (
                <CommandGroup key={label} heading={label} className="group/members">
                  {data?.map(({ id, icon, name, avatar }) => {
                    return (
                      <CommandItem
                        onSelect={() => onClick({ id, type })}
                        key={id}
                        className="my-1"
                      >
                        <Avatar>
                          <AvatarImage src={avatar} />
                        </Avatar>
                        <span className="ml-2">{name}</span>
                        {icon}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              );
            }

            if (type === "channel") {
              return (
                <CommandGroup key={label} heading={label}>
                  {data?.map(({ id, icon, name }) => {
                    return (
                      <CommandItem
                        onSelect={() => onClick({ id, type })}
                        key={id}
                      >
                        {icon}
                        <span>{name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              );
            }
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;
