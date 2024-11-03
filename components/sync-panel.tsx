"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
  docId: z.string().min(1, "Document ID is required"),
  repoPath: z.string().min(1, "Repository path is required"),
});

export function SyncPanel() {
  const [progress, setProgress] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
      docId: "",
      repoPath: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSyncing(true);
    setProgress(0);

    try {
      const response = await fetch("/api/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Sync failed");
      }

      toast({
        title: "Sync Complete",
        description: "Your wiki has been successfully synchronized.",
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "There was an error synchronizing your wiki.",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coda API Key</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your Coda API key"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Your Coda API key can be found in your account settings.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="docId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the Coda document ID"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The ID can be found in the document&apos;s URL.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="repoPath"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repository Path</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the local repository path"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The local path where the Git repository is located.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {syncing && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground text-center">
                Syncing wiki content...
              </p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={syncing}>
            {syncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              "Start Sync"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}