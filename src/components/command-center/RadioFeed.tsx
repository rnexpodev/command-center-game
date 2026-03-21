import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { formatGameTime } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import { useRadioFeed } from "@/hooks/useRadioFeed";
import { RadioPriority } from "@/data/radio-templates";
import { Radio } from "lucide-react";

const priorityStyles: Record<string, string> = {
  [RadioPriority.ROUTINE]: "text-zinc-300",
  [RadioPriority.IMPORTANT]: "text-yellow-400",
  [RadioPriority.CRITICAL]: "text-red-400 font-semibold",
};

const prioritySender: Record<string, string> = {
  [RadioPriority.ROUTINE]: "text-zinc-500",
  [RadioPriority.IMPORTANT]: "text-yellow-600",
  [RadioPriority.CRITICAL]: "text-red-600",
};

export function RadioFeed() {
  const messages = useRadioFeed();
  const selectEvent = useUIStore((s) => s.selectEvent);
  const scrollRef = useRef<HTMLDivElement>(null);
  const userScrolled = useRef(false);

  // Auto-scroll to top (newest messages are first)
  useEffect(() => {
    if (!userScrolled.current && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [messages]);

  function handleScroll() {
    if (!scrollRef.current) return;
    userScrolled.current = scrollRef.current.scrollTop > 10;
  }

  function handleMessageClick(eventId?: string) {
    if (eventId) selectEvent(eventId);
  }

  return (
    <div className="flex h-full flex-col border-s border-zinc-800 bg-zinc-900/90">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2">
        <Radio className="h-4 w-4 text-green-400" />
        <span className="text-sm font-medium text-zinc-300">קשר אלחוטי</span>
        <span className="diegetic-led diegetic-led-green ms-auto" />
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-2 space-y-1 text-xs"
      >
        {messages.length === 0 ? (
          <div className="text-center text-zinc-600 py-8">
            ממתין לשידורים...
          </div>
        ) : (
          messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => handleMessageClick(msg.eventId)}
              className={cn(
                "w-full text-start rounded px-2 py-1.5 transition-colors",
                "hover:bg-zinc-800/50",
                msg.eventId && "cursor-pointer",
                !msg.eventId && "cursor-default",
              )}
            >
              <div className="flex items-baseline gap-2">
                <span className="diegetic-mono text-zinc-600 shrink-0">
                  {formatGameTime(msg.tick)}
                </span>
                <span className={cn("shrink-0", prioritySender[msg.priority])}>
                  [{msg.sender}]
                </span>
              </div>
              <div
                className={cn(
                  "mt-0.5 leading-relaxed",
                  priorityStyles[msg.priority],
                )}
              >
                {msg.text}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
