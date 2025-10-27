"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
import { wsAtom } from "@/atoms/atom";

export default function LeavingToast() {
  const router = useRouter();
  const ws = useAtomValue(wsAtom);

  useEffect(() => {
    // Push initial history state
    window.history.pushState(null, "", window.location.href);

    const handlePopState = (e: PopStateEvent) => {
      // Prevent default back navigation
      e.preventDefault();

      // Show toast
      toast.dismiss();
      toast(
        <div className="flex flex-col gap-1">
          <p className="font-medium">You really want to leave?</p>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                toast.dismiss();
                ws?.send(JSON.stringify({ type: "leave" }));
                router.push("/");
              }}
              variant="destructive"
              size="sm"
            >
              leave
            </Button>
            <Button
              onClick={() => {
                toast.dismiss();
                window.history.pushState(null, "", window.location.href);
              }}
              variant="secondary"
              size="sm"
            >
              stay
            </Button>
          </div>
        </div>
      );
    };

    window.addEventListener("popstate", handlePopState);
  }, []);

  return null;
}
