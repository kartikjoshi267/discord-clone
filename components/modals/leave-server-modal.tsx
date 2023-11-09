"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import qs from "query-string";

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

const LeaveServerModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { onOpen, isOpen, type, onClose, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;
  const [loading, setLoading] = useState(false);

  const onLeave = async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/servers/${server?.id}/leave`);
      onClose();
      router.refresh();
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
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Do you really want to leave{" "}
            <strong className="text-indigo-500">{server?.name}</strong>?
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
            onClick={onLeave}
            className="bg-rose-500 text-white hover:bg-rose-800"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveServerModal;
