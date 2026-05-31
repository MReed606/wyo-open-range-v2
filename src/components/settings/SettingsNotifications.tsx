interface SettingsNotificationsProps {
  emailNotifications: boolean;
  smsNotifications: boolean;
  messageNotifications: boolean;
  forumNotifications: boolean;
  listingNotifications: boolean;

  setEmailNotifications: (
    value: boolean
  ) => void;

  setSmsNotifications: (
    value: boolean
  ) => void;

  setMessageNotifications: (
    value: boolean
  ) => void;

  setForumNotifications: (
    value: boolean
  ) => void;

  setListingNotifications: (
    value: boolean
  ) => void;
}

export default function SettingsNotifications({
  emailNotifications,
  smsNotifications,
  messageNotifications,
  forumNotifications,
  listingNotifications,
  setEmailNotifications,
  setSmsNotifications,
  setMessageNotifications,
  setForumNotifications,
  setListingNotifications,
}: SettingsNotificationsProps) {

  return (

    <div className="rounded-3xl border border-gray-200 p-6">

      <h2 className="mb-6 text-2xl font-black text-[#111827]">

        Notification Preferences

      </h2>

      <div className="space-y-5">

        <label className="flex items-center gap-4 text-lg font-semibold text-[#111827]">

          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) =>
              setEmailNotifications(
                e.target.checked
              )
            }
          />

          Email Notifications

        </label>

        <label className="flex items-center gap-4 text-lg font-semibold text-[#111827]">

          <input
            type="checkbox"
            checked={smsNotifications}
            onChange={(e) =>
              setSmsNotifications(
                e.target.checked
              )
            }
          />

          SMS Notifications

        </label>

        <label className="flex items-center gap-4 text-lg font-semibold text-[#111827]">

          <input
            type="checkbox"
            checked={messageNotifications}
            onChange={(e) =>
              setMessageNotifications(
                e.target.checked
              )
            }
          />

          New Message Alerts

        </label>

        <label className="flex items-center gap-4 text-lg font-semibold text-[#111827]">

          <input
            type="checkbox"
            checked={forumNotifications}
            onChange={(e) =>
              setForumNotifications(
                e.target.checked
              )
            }
          />

          Forum Reply Alerts

        </label>

        <label className="flex items-center gap-4 text-lg font-semibold text-[#111827]">

          <input
            type="checkbox"
            checked={listingNotifications}
            onChange={(e) =>
              setListingNotifications(
                e.target.checked
              )
            }
          />

          Listing Activity Alerts

        </label>

      </div>

    </div>

  );
}