"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";

const formSchema = z.object({
  'invite-link': z.string().min(1, {
    message: "Invite link is required",
  }),
});

const JoinServerModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { isOpen, type, onClose } = useModal();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isModalOpen = isOpen && type === "joinServer";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      'invite-link': "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      form.reset();
      router.push(values["invite-link"]);
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    form.reset();
    onClose();
  }

  if (!isMounted) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleBack}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Join a server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Enter a valid invite link <strong>(full url is required)</strong>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="invite-link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Invite Link
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter invite link"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button type="submit" variant={"primary"} disabled={isLoading}>
                Join
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinServerModal;
