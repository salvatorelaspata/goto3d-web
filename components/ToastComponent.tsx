"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function ToastComponent() {
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("realtime project")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "project",
          filter: "status=eq.done",
        },
        (payload) => {
          toast.success(`Project completato ${payload.new.name}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return <ToastContainer />;
}
