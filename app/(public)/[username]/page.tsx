"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { MoreVertical } from "lucide-react";
import { useGetPublicProfile } from "@/app/services/links";
import Link from "next/link";

export default function PublicLinkPreview() {
  const params = useParams();
  const username = params.username as string;
  const { data: profile, isLoading, error } = useGetPublicProfile(username);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Profile Not Found
          </h1>
          <p className="text-gray-600 mb-6">This profile doesn't exist.</p>
          <Link
            href="/"
            className="inline-block bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const { user, links } = profile.data;
  const initial = user?.fullName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center mb-6">
          {/* Profile Image */}
          <div className="mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mx-auto">
              {user?.profileImage ? (
                <Image
                  src={user?.profileImage}
                  alt={user?.fullName}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold text-gray-600">
                  {initial}
                </span>
              )}
            </div>
          </div>

          {/* User Info */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {user?.fullName}
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            {user?.bio || "No bio added yet."}
          </p>
        </div>

        {/* Links Section */}
        {links && links.length > 0 ? (
          <div className="space-y-3">
            {links?.map((link: any) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow group"
              >
                {link.icon && (
                  <Image
                    src={link.icon}
                    alt={link.title}
                    width={24}
                    height={24}
                    className="rounded object-cover"
                  />
                )}
                <span className="flex-1 font-medium text-gray-900">
                  {link.title}
                </span>
                <MoreVertical
                  size={18}
                  className="text-gray-400 group-hover:text-gray-600 transition-colors"
                />
              </a>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray-500">No links added yet.</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Powered by Card Connect</p>
        </div>
      </div>
    </div>
  );
}
