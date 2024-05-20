"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastComponent() {
  // const sendNotification = (title: string, body: string) => {
  //   if (Notification.permission === "granted") {
  //     const n = new Notification(title, { body, icon: "/favicon.ico" })
  //   }
  // };
  useEffect(() => {
    // request permission for notifications
    // if (Notification.permission !== "granted") Notification.requestPermission();
    // else console.log("Notifications are already granted");

    const supabase = createClient();
    // supabase.auth.onAuthStateChange((event, session) => {
    //   if (event === "SIGNED_IN") {
    //     toast.success("Signed in");
    //   }
    //   if (event === "SIGNED_OUT") {
    //     toast.success("Signed out");
    //   }
    // });
    // console.log("[ToastComponent] subscribing to changes");
    supabase
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
  }, []);
  return (
    <>
      <ToastContainer />
      {/* <button onClick={() => sendNotification("Hello", "World")}>Notify</button> */}
    </>
  );
}
