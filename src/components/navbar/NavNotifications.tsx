import Link from "next/link";
import { Bell } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  link?: string | null;
  read?: boolean;
};

interface NavNotificationsProps {
  loggedIn: boolean;
  unreadCount: number;
  showNotifications: boolean;
  notifications: Notification[];
  setShowNotifications: (
    value: boolean
  ) => void;
  markNotificationsRead: () => Promise<void>;
}

export default function NavNotifications({
  loggedIn,
  unreadCount,
  showNotifications,
  notifications,
  setShowNotifications,
  markNotificationsRead,
}: NavNotificationsProps) {
  if (!loggedIn) {
    return null;
  }

  return (
    <div className="relative">

      <button
        onClick={async () => {

          setShowNotifications(
            !showNotifications
          );

          await markNotificationsRead();

        }}
        className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white transition hover:bg-gray-50"
      >

        <Bell className="h-5 w-5 text-[#111827]" />

        {unreadCount > 0 && (

          <div className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#2F5D50] px-1 text-[10px] font-black text-white">

            {unreadCount}

          </div>

        )}

      </button>

      {showNotifications && (

        <div className="fixed left-1/2 top-24 z-50 w-[calc(100vw-2rem)] max-w-[380px] -translate-x-1/2 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl md:absolute md:left-auto md:right-0 md:top-auto md:w-[380px] md:translate-x-0">

          <div className="border-b border-gray-100 px-6 py-5">

            <h2 className="text-xl font-black text-[#111827]">

              Notifications

            </h2>

          </div>

          <div className="max-h-[500px] overflow-y-auto">

            {!notifications.length && (

              <div className="p-8 text-center text-sm font-semibold text-[#6B7280]">

                No notifications yet.

              </div>

            )}

            {notifications.map((n) => (

              <Link
                key={n.id}
                href={n.link || "#"}
                className={`block border-b border-gray-100 px-6 py-5 transition hover:bg-gray-50 ${
                  !n.read
                    ? "bg-[#2F5D50]/5"
                    : ""
                }`}
              >

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <div className="text-sm font-black text-[#111827]">

                      {n.title}

                    </div>

                    <div className="mt-2 text-sm leading-6 text-[#4B5563]">

                      {n.message}

                    </div>

                  </div>

                  {!n.read && (

                    <div className="mt-1 h-3 w-3 rounded-full bg-[#2F5D50]" />

                  )}

                </div>

              </Link>

            ))}

          </div>

        </div>

      )}

    </div>
  );
}