"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import qs from 'query-string';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const DeleteChannelModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { isOpen, type, onClose, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteChannel";
  const { server, channel } = data;
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}/`,
        query: {
          serverId: server?.id,
        }
      });

      await axios.delete(url);
      onClose();
      router.refresh();
      router.push(`/servers/${server?.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Do you really want to delete{" "}
            <strong className="text-indigo-500">#{channel?.name}</strong>?
            <br />
            By doing so, all the messages will be lost.
            <br />
            <strong className="text-rose-600">This cannot be undone</strong>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4 flex flex-row justify-between">
          <Button
            disabled={loading}
            onClick={onClose}
            className="bg-zinc-300 hover:bg-zinc-500"
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={onDelete}
            className="bg-rose-500 text-white hover:bg-rose-800"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;
