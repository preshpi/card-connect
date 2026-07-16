"use client";

import { useParams } from "next/navigation";
import { useGetPublicProfile } from "@/app/services/links";
import Link from "next/link";
import ProfileRenderer from "@/app/components/profile/ProfileRenderer";
import { DEFAULT_PROFILE_DESIGN } from "@/app/types/design";

export default function PublicLinkPreview() {
  const params = useParams();
  const username = params.username as string;
  const { data: profile, isLoading, error } = useGetPublicProfile(username);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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

  return (
    <ProfileRenderer
      user={{
        fullName: user?.fullName,
        bio: user?.bio,
        profileImage: user?.profileImage,
        username: user?.username,
      }}
      links={links || []}
      socialLinks={user?.socialLinks || []}
      design={user?.design || DEFAULT_PROFILE_DESIGN}
    />
  );
}
