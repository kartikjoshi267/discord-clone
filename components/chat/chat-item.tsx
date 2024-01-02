"use client"

import * as z from 'zod';
import axios from "axios";
import qs from "query-string";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect, useState} from 'react';
import {Member, MemberRole, Profile} from "@prisma/client";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import ActionTooltip from "@/components/action-tooltip";
import {Edit, FileIcon, ShieldAlert, ShieldCheck, Trash} from "lucide-react";
import Image from "next/image";
import {cn} from "@/lib/utils";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useModal} from "@/hooks/use-modal-store";
import {useRouter, useParams} from "next/navigation";

interface ChatItemProps {
    id: string;
    content: string;
    member: Member & {
        profile: Profile
    };
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

const roleIconMap = {
    "GUEST": null,
    "ADMIN": <ShieldAlert className={'h-4 w-4 ml-2 text-rose-500'} />,
    "MODERATOR": <ShieldCheck className={'h-4 w-4 ml-2 text-indigo-500'} />,
}

const formSchema = z.object({
    content: z.string().min(1),
});

const ChatItem = ({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery,
}: ChatItemProps) => {
    const router = useRouter();
    const params = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const { onOpen } = useModal();

    const onMemberClick = () => {
        if (member.id === currentMember.id){
            return;
        }
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
    }

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === "Escape" || event.keyCode === 27){
                form.reset();
                setIsEditing(false);
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const fileType = fileUrl?.split('.').pop();

    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isOwner = currentMember.id === member.id;
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canUpdateMessage = !deleted && isOwner && !fileUrl;
    const isPdf = fileType === "pdf" && fileUrl;
    const isImage = !isPdf && fileUrl;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: content,
        }
    });

    useEffect(() => {
        form.reset({
            content: content
        })
    }, [form, content]);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery
            })

            await axios.patch(url, values);

            form.reset();
            setIsEditing(false);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={'relative group flex items-center hover:bg-black/5 p-4 transition w-full'}>
            <div className={`group flex gap-x-2 items-start w-full`}>
                <div className={'cursor-pointer hover:drop-shadow-md transition'}>
                    <Avatar onClick={onMemberClick}>
                        <AvatarImage
                            src={member.profile.imageUrl}
                        />
                    </Avatar>
                </div>
                <div className={'flex flex-col w-full'}>
                    <div className={'flex items-center gap-x-2'}>
                        <div className={"flex items-center"}>
                            <p className={'font-semibold text-sm hover:underline cursor-pointer'} onClick={onMemberClick}>
                                {member.profile.name}
                                {member.profileId === currentMember.profileId && (<span className={'ml-1 text-zinc-500 dark:text-zinc-400'}>(You)</span>)}
                            </p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className={'text-xs text-zinc-500 dark:text-zinc-400'}>{timestamp}</span>
                    </div>
                    {isImage && (
                        <a href={fileUrl} target={"_blank"} rel={"noopener noreferrer"} className={"relative aspect-square rounded-md overflow-hidden mt-2 border flex items-center bg-secondary h-48 w-48"}>
                            <Image src={fileUrl} alt={fileUrl} fill className={"object-cover"}/>
                        </a>
                    )}
                    {isPdf && (
                        <a className={'relative flex items-center p-2 mt-2 rounded-md bg-background/10'} href={fileUrl} target={"_blank"} rel={"noopener noreferrer"}>
                            <FileIcon className={'h-10 w-10 fill-indigo-200 stroke-indigo-400'}/>
                            <div className={"ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"}>
                                PDF file
                            </div>
                        </a>
                    )}
                    {!fileUrl && !isEditing && (
                        <p className={cn(
                            'text-sm text-zinc-600 dark:text-zinc-300',
                            deleted && 'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1'
                        )}>
                            {content}
                            {isUpdated && !deleted && (
                                <span className={'text-[10px] mx-2 text-zinc-500 dark:text-zinc-400'}>
                                    (edited)
                                </span>
                            )}
                        </p>
                    )}
                    {!fileUrl && isEditing && (
                        <Form {...form}>
                            <form className={'flex items-center w-full gap-x-2 pt-2'} onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField control={form.control} name={'content'} render={({ field }) => (
                                    <FormItem
                                        className={'flex-1'}
                                    >
                                        <FormControl>
                                            <div className={'relative w-full'}>
                                                <Input
                                                    disabled={isLoading}
                                                    className={'p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'}
                                                    placeholder={'Edited message'}
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )} />
                                <Button size={'sm'} variant={'primary'} disabled={isLoading}>
                                    Save
                                </Button>
                            </form>
                            <span className={'text-[10px] mt-1 text-zinc-400'}>
                                Press escape to cancel (all changes will be discarded), enter to save
                            </span>
                        </Form>
                    )}
                </div>
            </div>
            {canDeleteMessage && (
                <div className={'hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm'}>
                    {canUpdateMessage && (
                        <ActionTooltip label={"Edit"}>
                            <Edit onClick={() => setIsEditing(true)} className={"cursor-pointer ml-auto h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"}/>
                        </ActionTooltip>
                    )}
                    <ActionTooltip label={"Delete"}>
                        <Trash onClick={() => onOpen('deleteMessage', {
                            apiUrl: `${socketUrl}/${id}`,
                            query: socketQuery,
                        })} className={"cursor-pointer ml-auto h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"}/>
                    </ActionTooltip>
                </div>
            )}
        </div>
    );
};

export default ChatItem;