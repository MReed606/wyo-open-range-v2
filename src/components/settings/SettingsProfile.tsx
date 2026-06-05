interface SettingsProfileProps {
  fullName: string;
  phone: string;
  avatar: string;
  bio: string;

  setFullName: (
    value: string
  ) => void;

  setPhone: (
    value: string
  ) => void;

  setAvatar: (
    value: string
  ) => void;

  setBio: (
    value: string
  ) => void;
}

export default function SettingsProfile({
  fullName,
  phone,
  avatar,
  bio,
  setFullName,
  setPhone,
  setAvatar,
  setBio,
}: SettingsProfileProps) {

  return (

    <div className="space-y-5">

      <h2 className="text-xl md:text-2xl font-black text-[#111827]">

        Profile Information

      </h2>

      <input
        value={fullName}
        onChange={(e) =>
          setFullName(
            e.target.value
          )
        }
        placeholder="Full name"
        className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base md:text-lg font-semibold text-[#111827]"
      />

      <input
        value={phone}
        onChange={(e) =>
          setPhone(
            e.target.value
          )
        }
        placeholder="Phone number"
        className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base md:text-lg font-semibold text-[#111827]"
      />

      <input
        value={avatar}
        onChange={(e) =>
          setAvatar(
            e.target.value
          )
        }
        placeholder="Avatar image URL"
        className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base md:text-lg font-semibold text-[#111827]"
      />

      <textarea
        value={bio}
        onChange={(e) =>
          setBio(
            e.target.value
          )
        }
        placeholder="Bio"
        rows={6}
        className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base md:text-lg font-semibold text-[#111827]"
      />

    </div>

  );
}