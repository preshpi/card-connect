import Image from "next/image";

const links = [
  {
    label: "Tiktok",
    url: "https://www.tiktok.com/@precious-egwuenu",
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/precious-egwuenu",
  },
  {
    label: "Twitter",
    url: "https://twitter.com/precious",
  },
  {
    label: "Facebook",
    url: "https://facebook.com/precious",
  },
];

const MyLink = () => {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 px-6 py-10 md:px-10 grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* Left column */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Link</h1>

          {/* Profile */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              {/* <Icons.userIcon className="w-8 h-8 text-gray-400" /> */}
            </div>
            <div>
              <p className="font-semibold text-gray-900">Precious Egwuenu</p>
              <p className="text-sm text-gray-600">
                Web Developer and Content Creator
              </p>
            </div>
          </div>

          {/* Add link */}
          <button className="w-full bg-[#111827] text-white py-4 rounded-xl mb-8">
            + Add Link
          </button>

          {/* Links list */}
          <div className="space-y-4">
            {links.map((link) => (
              <div
                key={link.label}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {/* <Icons.dragIcon className="text-gray-400" /> */}
                  <div>
                    <p className="font-medium text-gray-900">{link.label}</p>
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {link.url}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* <Icons.editIcon className="text-gray-500 cursor-pointer" /> */}
                  {/* <Icons.trashIcon className="text-gray-500 cursor-pointer" /> */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right preview */}
        <div className="hidden xl:flex border-l pl-12 flex-col items-center gap-6">
          <div className="border max-w-fit gap-x-3 rounded-lg border-[#EBEBEB] px-4 py-3 flex items-center">
            <p className="text-[#1B231F]">cardconnect/precious...</p>
            <Image
              src="/assets/icons/Link.svg"
              alt="Copy Icon"
              width={20}
              height={20}
            />
          </div>
          <div className="w-[320px] h-164 rounded-3xl bg-white shadow px-5 border-[#ECECED] border">
            <div className="flex flex-col items-center mb-14 mt-20 gap-2">
              <div className="w-20 h-20 rounded-full bg-gray-200 mb-3" />
              <p className="font-semibold text-gray-900">@precious-egwuenu</p>
            </div>

            <div className="space-y-3">
              {links.map((link) => (
                <button
                  key={link.label}
                  className="w-full py-3 rounded-xl bg-gray-100 text-gray-900"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLink;
