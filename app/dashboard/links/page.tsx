"use client";

import { DragEvent, useState } from "react";
import { Grip, MoreVertical, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/app/store/useAuthStore";
import {
  useCreateLink,
  useDeleteLink,
  useGetLinks,
  useReorderLinks,
  useUpdateLink,
} from "@/app/services/links";
import { getApiErrorMessage } from "@/app/utils/apiError";
import { toast } from "sonner";
import { LinkItem } from "@/app/types/links";
import AddLinkModal from "@/app/dashboard/links/modals/AddLinkModal";
import EditLinkModal from "@/app/dashboard/links/modals/EditLinkModal";
import DeleteLinkModal from "@/app/dashboard/links/modals/DeleteLinkModal";
import ShareLinkModal from "@/app/dashboard/links/modals/ShareLinkModal";

const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dpokiomqq/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "card_connect";

const MyLink = () => {
  const user = useAuthStore((state) => state.user);
  const fullName =
    user?.fullName?.trim() ||
    `${user?.firstname || ""} ${user?.lastname || ""}`.trim() ||
    "User";
  const bio = user?.bio?.trim() || "No bio added yet.";
  const profileImage = user?.profileImage?.trim();
  const initial = fullName.charAt(0).toUpperCase();
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [showEditLinkModal, setShowEditLinkModal] = useState(false);
  const [showDeleteLinkModal, setShowDeleteLinkModal] = useState(false);
  const [showShareLinkModal, setShowShareLinkModal] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [addIconDataUrl, setAddIconDataUrl] = useState("");
  const [addIconFile, setAddIconFile] = useState<File | null>(null);
  const [isAddIconUploading, setIsAddIconUploading] = useState(false);
  const [addIconInputKey, setAddIconInputKey] = useState(0);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);
  const [draggingLinkId, setDraggingLinkId] = useState<string | null>(null);
  const [dragOverLinkId, setDragOverLinkId] = useState<string | null>(null);
  const [pendingOrderIds, setPendingOrderIds] = useState<string[] | null>(null);
  const [editTitleInput, setEditTitleInput] = useState("");
  const [editUrlInput, setEditUrlInput] = useState("");
  const [editIconDataUrl, setEditIconDataUrl] = useState("");
  const [editIconFile, setEditIconFile] = useState<File | null>(null);
  const [isEditIconUploading, setIsEditIconUploading] = useState(false);
  const [editIconInputKey, setEditIconInputKey] = useState(0);
  const [sharingLink, setSharingLink] = useState<LinkItem | null>(null);
  const { data: linksResponse, isLoading: isLinksLoading } = useGetLinks();
  const { mutate: createLink, isPending: isCreatingLink } = useCreateLink();
  const { mutate: updateLink, isPending: isUpdatingLink } = useUpdateLink();
  const { mutate: deleteLink, isPending: isDeletingLink } = useDeleteLink();
  const { mutate: reorderLinks } = useReorderLinks();

  const baseLinks = linksResponse?.data ?? [];
  const links = pendingOrderIds
    ? (() => {
        const linkMap = new Map(baseLinks.map((item) => [item.id, item]));
        const ordered = pendingOrderIds
          .map((id) => linkMap.get(id))
          .filter((item): item is LinkItem => Boolean(item));
        const missing = baseLinks.filter(
          (item) => !item.id || !pendingOrderIds.includes(item.id),
        );
        return [...ordered, ...missing];
      })()
    : baseLinks;
  const hasLinks = links.length > 0;

  const resetAddLinkForm = () => {
    setTitleInput("");
    setUrlInput("");
    setAddIconDataUrl("");
    setAddIconFile(null);
    setIsAddIconUploading(false);
    setAddIconInputKey((value) => value + 1);
  };

  const resetEditLinkForm = () => {
    setEditingLinkId(null);
    setEditTitleInput("");
    setEditUrlInput("");
    setEditIconDataUrl("");
    setEditIconFile(null);
    setIsEditIconUploading(false);
    setEditIconInputKey((value) => value + 1);
  };

  const resetDeleteLinkForm = () => {
    setDeletingLinkId(null);
  };

  const resetDragState = () => {
    setDraggingLinkId(null);
    setDragOverLinkId(null);
  };

  const reorderList = (
    list: LinkItem[],
    fromId: string,
    toId: string,
  ): LinkItem[] => {
    const fromIndex = list.findIndex((item) => item.id === fromId);
    const toIndex = list.findIndex((item) => item.id === toId);

    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
      return list;
    }

    const next = [...list];
    const [movedItem] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, movedItem);
    return next;
  };

  const getAutoThumbnailFromUrl = (url: string) => {
    const normalizedUrl =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;

    try {
      new URL(normalizedUrl);
      return `https://image.thum.io/get/width/600/crop/800/noanimate/${encodeURIComponent(normalizedUrl)}`;
    } catch {
      return "";
    }
  };

  const uploadImageToCloudinary = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Please select an image file.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Upload failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();

    if (!data?.secure_url) {
      throw new Error("Cloudinary did not return an image URL.");
    }

    return data.secure_url as string;
  };

  const readFileToDataUrl = (file: File, onRead: (result: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onRead(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddIconFileChange = (file: File | null) => {
    if (!file) {
      setAddIconDataUrl("");
      setAddIconFile(null);
      return;
    }

    setAddIconFile(file);
    readFileToDataUrl(file, setAddIconDataUrl);
  };

  const handleEditIconFileChange = (file: File | null) => {
    if (!file) {
      setEditIconDataUrl("");
      setEditIconFile(null);
      return;
    }

    setEditIconFile(file);
    readFileToDataUrl(file, setEditIconDataUrl);
  };

  const handleAddLink = async () => {
    const title = titleInput.trim();
    const url = urlInput.trim();

    if (!title) {
      toast.error("Link title is required.");
      return;
    }

    if (!url) {
      toast.error("A valid URL is required.");
      return;
    }

    let uploadedIconUrl = "";

    if (addIconFile) {
      setIsAddIconUploading(true);
      try {
        uploadedIconUrl = await uploadImageToCloudinary(addIconFile);
      } catch (error) {
        toast.error(
          getApiErrorMessage(error, "Failed to upload icon. Please try again."),
        );
        return;
      } finally {
        setIsAddIconUploading(false);
      }
    }

    const icon =
      uploadedIconUrl ||
      getAutoThumbnailFromUrl(url) ||
      "https://www.google.com/s2/favicons?domain=example.com&sz=128";

    createLink(
      {
        title,
        url,
        icon: icon || "https://example.com/icon.svg",
      },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Link created successfully.");
          setPendingOrderIds(null);
          setShowAddLinkModal(false);
          resetAddLinkForm();
        },
        onError: (error: unknown) => {
          toast.error(
            getApiErrorMessage(
              error,
              "Failed to create link. Please try again.",
            ),
          );
        },
      },
    );
  };

  const openEditLinkModal = (link: LinkItem) => {
    if (!link.id) {
      toast.error("This link cannot be edited right now.");
      return;
    }

    setEditingLinkId(link.id);
    setEditTitleInput(link.title);
    setEditUrlInput(link.url);
    setEditIconDataUrl(link.icon || "");
    setEditIconFile(null);
    setEditIconInputKey((value) => value + 1);
    setShowEditLinkModal(true);
  };

  const handleUpdateLink = async () => {
    if (!editingLinkId) {
      toast.error("Missing link id for update.");
      return;
    }

    const title = editTitleInput.trim();
    const url = editUrlInput.trim();

    if (!title) {
      toast.error("Link title is required.");
      return;
    }

    if (!url) {
      toast.error("A valid URL is required.");
      return;
    }

    let uploadedIconUrl = "";

    if (editIconFile) {
      setIsEditIconUploading(true);
      try {
        uploadedIconUrl = await uploadImageToCloudinary(editIconFile);
      } catch (error) {
        toast.error(
          getApiErrorMessage(error, "Failed to upload icon. Please try again."),
        );
        return;
      } finally {
        setIsEditIconUploading(false);
      }
    }

    const icon =
      uploadedIconUrl ||
      editIconDataUrl ||
      getAutoThumbnailFromUrl(url) ||
      "https://www.google.com/s2/favicons?domain=example.com&sz=128";

    updateLink(
      {
        id: editingLinkId,
        data: {
          title,
          url,
          icon,
        },
      },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Link updated successfully.");
          setPendingOrderIds(null);
          setShowEditLinkModal(false);
          resetEditLinkForm();
        },
        onError: (error: unknown) => {
          toast.error(
            getApiErrorMessage(
              error,
              "Failed to update link. Please try again.",
            ),
          );
        },
      },
    );
  };

  const openDeleteLinkModal = (link: LinkItem) => {
    if (!link.id) {
      toast.error("This link cannot be deleted right now.");
      return;
    }

    setDeletingLinkId(link.id);
    setShowDeleteLinkModal(true);
  };

  const handleDeleteLink = () => {
    if (!deletingLinkId) {
      toast.error("Missing link id for delete.");
      return;
    }

    deleteLink(deletingLinkId, {
      onSuccess: (response) => {
        const message =
          response.data?.message ||
          response.message ||
          "Link deleted successfully.";
        toast.success(message);
        setPendingOrderIds(null);
        setShowDeleteLinkModal(false);
        resetDeleteLinkForm();
      },
      onError: (error: unknown) => {
        toast.error(
          getApiErrorMessage(error, "Failed to delete link. Please try again."),
        );
      },
    });
  };

  const openShareLinkModal = (link: LinkItem) => {
    setSharingLink(link);
    setShowShareLinkModal(true);
  };

  const handleCopyShareLink = async () => {
    if (!sharingLink?.url) return;

    try {
      await navigator.clipboard.writeText(sharingLink.url);
      toast.success("Link copied.");
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleDragStart = (linkId: string) => {
    setDraggingLinkId(linkId);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>, linkId: string) => {
    event.preventDefault();
    if (dragOverLinkId !== linkId) {
      setDragOverLinkId(linkId);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, targetId: string) => {
    event.preventDefault();

    if (!draggingLinkId || draggingLinkId === targetId) {
      resetDragState();
      return;
    }

    const currentLinks = links;
    const nextLinks = reorderList(currentLinks, draggingLinkId, targetId);

    if (nextLinks === currentLinks) {
      resetDragState();
      return;
    }

    setPendingOrderIds(
      nextLinks
        .map((link) => link.id)
        .filter((id): id is string => Boolean(id)),
    );

    const order = nextLinks.map((link, index) => ({
      id: link.id,
      index,
    }));

    if (order.some((item) => !item.id)) {
      toast.error("Some links cannot be reordered right now.");
      setPendingOrderIds(null);
      resetDragState();
      return;
    }

    reorderLinks(
      {
        order: order as Array<{ id: string; index: number }>,
      },
      {
        onError: (error: unknown) => {
          setPendingOrderIds(null);
          toast.error(
            getApiErrorMessage(
              error,
              "Failed to reorder links. Please try again.",
            ),
          );
        },
      },
    );

    resetDragState();
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 px-6 py-10 md:px-10 grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* Left column */}
        <div>
          {/* Profile */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt={fullName}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-gray-600">
                  {initial}
                </span>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{fullName}</p>
              <p className="text-sm text-gray-600">{bio}</p>
            </div>
          </div>

          {/* Add link */}
          <button
            onClick={() => setShowAddLinkModal(true)}
            className="w-full bg-[#111827] text-white py-4 rounded-xl mb-8"
          >
            + Add Link
          </button>

          {/* Links list */}
          {isLinksLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={`links-skeleton-${item}`}
                  className="animate-pulse rounded-xl border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-x-10">
                      <div className="h-5 w-5 rounded bg-gray-200" />
                      <div className="space-y-2">
                        <div className="h-4 w-28 rounded bg-gray-200" />
                        <div className="h-3 w-52 rounded bg-gray-100" />
                      </div>
                    </div>
                    <div className="h-5 w-5 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : hasLinks ? (
            <div className="space-y-4">
              {links.map((link: LinkItem) => (
                <div
                  key={link.id || `${link.title}-${link.url}`}
                  draggable={Boolean(link.id)}
                  onDragStart={() => link.id && handleDragStart(link.id)}
                  onDragOver={(event) =>
                    link.id && handleDragOver(event, link.id)
                  }
                  onDrop={(event) => link.id && handleDrop(event, link.id)}
                  onDragEnd={resetDragState}
                  className={`bg-white rounded-xl border p-4 flex items-center justify-between transition-colors ${
                    dragOverLinkId === link.id && draggingLinkId !== link.id
                      ? "border-[#111827]"
                      : "border-gray-200"
                  } ${draggingLinkId === link.id ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center gap-4 justify-between w-full">
                    <div className="flex items-center gap-x-10 cursor-grab">
                      <Grip size={20} color="#B3B5B4" />
                      <div>
                        <div className="flex items-center gap-x-3">
                          {link.icon ? (
                            <Image
                              src={link.icon}
                              alt={link.title}
                              width={25}
                              height={25}
                              className="object-cover"
                            />
                          ) : null}
                          <p className="font-medium text-gray-900">
                            {link.title}
                          </p>
                          <button
                            type="button"
                            onClick={() => openEditLinkModal(link)}
                            aria-label={`Edit ${link.title}`}
                            className="rounded p-1 hover:bg-gray-100"
                          >
                            <Pencil size={16} color="#000000" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 truncate max-w-xs pt-2">
                          {link.url}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openDeleteLinkModal(link)}
                      aria-label={`Delete ${link.title}`}
                      className="rounded p-1 hover:bg-red-50"
                    >
                      <Trash size={20} color="#000000" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <Grip size={22} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                No links yet
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Add your first link to start building your public profile.
              </p>
              <button
                onClick={() => setShowAddLinkModal(true)}
                className="mt-6 rounded-xl bg-[#111827] px-5 py-3 text-sm font-medium text-white hover:bg-black"
              >
                Add your first link
              </button>
            </div>
          )}
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
            <div className="flex flex-col items-center mb-8 mt-16 gap-2">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt={fullName}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold text-gray-600">
                    {initial}
                  </span>
                )}
              </div>{" "}
              <div className="text-center">
                <p className="font-semibold text-gray-900">{fullName}</p>
                <p className="text-sm text-gray-600">{bio}</p>
              </div>{" "}
            </div>

            <div className="space-y-3">
              {links.map((link: LinkItem) => (
                <div
                  key={`preview-${link.id || `${link.title}-${link.url}`}`}
                  className="w-full rounded-xl bg-gray-100 px-3 py-4 text-gray-900"
                >
                  <div className="flex items-center justify-between gap-2">
                    {link.icon ? (
                      <Image
                        src={link.icon}
                        alt={link.title}
                        width={20}
                        height={20}
                        className="rounded object-cover"
                      />
                    ) : null}
                    <span className="truncate">{link.title}</span>
                    <button
                      type="button"
                      onClick={() => openShareLinkModal(link)}
                      aria-label={`Share ${link.title}`}
                      className="rounded p-1 hover:bg-gray-200"
                    >
                      <MoreVertical size={18} color="#1D1F2C" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddLinkModal
        open={showAddLinkModal}
        titleInput={titleInput}
        urlInput={urlInput}
        iconPreview={addIconDataUrl}
        fileInputKey={addIconInputKey}
        isCreatingLink={isCreatingLink || isAddIconUploading}
        onTitleChange={setTitleInput}
        onUrlChange={setUrlInput}
        onIconFileChange={handleAddIconFileChange}
        onClose={() => {
          setShowAddLinkModal(false);
          resetAddLinkForm();
        }}
        onSubmit={handleAddLink}
      />

      <EditLinkModal
        open={showEditLinkModal}
        editTitleInput={editTitleInput}
        editUrlInput={editUrlInput}
        iconPreview={editIconDataUrl}
        fileInputKey={editIconInputKey}
        isUpdatingLink={isUpdatingLink || isEditIconUploading}
        onTitleChange={setEditTitleInput}
        onUrlChange={setEditUrlInput}
        onIconFileChange={handleEditIconFileChange}
        onClose={() => {
          setShowEditLinkModal(false);
          resetEditLinkForm();
        }}
        onSubmit={handleUpdateLink}
      />

      <DeleteLinkModal
        open={showDeleteLinkModal}
        isDeletingLink={isDeletingLink}
        onClose={() => {
          setShowDeleteLinkModal(false);
          resetDeleteLinkForm();
        }}
        onConfirm={handleDeleteLink}
      />

      <ShareLinkModal
        open={showShareLinkModal}
        title={sharingLink?.title || "Untitled Link"}
        url={sharingLink?.url || ""}
        coverImage={sharingLink?.icon || ""}
        onClose={() => {
          setShowShareLinkModal(false);
          setSharingLink(null);
        }}
        onCopy={handleCopyShareLink}
      />
    </div>
  );
};

export default MyLink;
