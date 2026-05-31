import { Send } from "lucide-react";

interface MessageComposerProps {
  message: string;
  sending: boolean;
  typing: boolean;
  messageCount: number;

  handleTyping: (
    value: string
  ) => void;

  sendMessage: () => void;
}

export default function MessageComposer({
  message,
  sending,
  typing,
  messageCount,
  handleTyping,
  sendMessage,
}: MessageComposerProps) {

  return (

    <div className="border-t border-gray-200 bg-white p-6">

      <div className="flex gap-4">

        <textarea
          value={message}
          onChange={(e) =>
            handleTyping(
              e.target.value
            )
          }
          placeholder="Type your message..."
          className="min-h-[90px] flex-1 rounded-2xl border border-gray-300 px-5 py-4 text-[#111827] outline-none transition focus:border-[#2F5D50]"
        />

        <button
          onClick={sendMessage}
          disabled={
            sending ||
            !message.trim()
          }
          className="flex w-20 items-center justify-center rounded-2xl bg-[#2F5D50] text-white transition hover:bg-[#24473d] disabled:opacity-50"
        >

          <Send className="h-6 w-6" />

        </button>

      </div>

      <div className="mt-4 flex items-center justify-between text-sm font-semibold text-[#6B7280]">

        <div>

          {typing
            ? "Typing..."
            : "Connected"}

        </div>

        <div>

          {messageCount} messages

        </div>

      </div>

    </div>

  );
}