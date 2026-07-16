"use client";

import { DragEvent, useState } from "react";
import { Grip, Pencil, ShareIcon, Trash, Plus } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/app/store/useAuthStore";
import {
  useCreateLink,
  useDeleteLink,
  useGetLinks,
  useReorderLinks,
  useUpdateLink,
  useCreateGroup,
  useRenameGroup,
  useDeleteGroup,
  useMoveLink,
} from "@/app/services/links";
import { getApiErrorMessage } from "@/app/utils/apiError";
import { toast } from "sonner";
import { LinkItem, LinkGroup } from "@/app/types/links";
import AddLinkModal from "@/app/(dashboard)/dashboard/links/modals/AddLinkModal";
import EditLinkModal from "@/app/(dashboard)/dashboard/links/modals/EditLinkModal";
import DeleteLinkModal from "@/app/(dashboard)/dashboard/links/modals/DeleteLinkModal";
import ShareLinkModal from "@/app/(dashboard)/dashboard/links/modals/ShareLinkModal";
import PreviewLinkModal from "./modals/PreviewLinkModal";
import ShareProfileModal from "./modals/ShareProfileModal";
import CreateGroupModal from "./modals/CreateGroupModal";
import RenameGroupModal from "./modals/RenameGroupModal";
import DeleteGroupModal from "./modals/DeleteGroupModal";
import MoveToGroupModal from "./modals/MoveToGroupModal";
import ProfileRenderer from "@/app/components/profile/ProfileRenderer";
import PhoneFrame from "@/app/components/profile/PhoneFrame";
import { DEFAULT_PROFILE_DESIGN } from "@/app/types/design";
import { useDesignStore } from "@/app/store/useDesignStore";
import { groupLinksByGroup } from "@/app/utils/links";
import LinkGroupHeader from "./components/LinkGroupHeader";

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
  const [addLinkGroupId, setAddLinkGroupId] = useState<string | null>(null);
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
  const [editLinkGroupId, setEditLinkGroupId] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [sharingLink, setSharingLink] = useState<LinkItem | null>(null);
  const [showShareProfileModal, setShowShareProfileModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showRenameGroupModal, setShowRenameGroupModal] = useState(false);
  const [renamingGroupId, setRenamingGroupId] = useState<string | null>(null);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  const [showMoveToGroupModal, setShowMoveToGroupModal] = useState(false);
  const [movingLinkId, setMovingLinkId] = useState<string | null>(null);
  const [movingLinkTitle, setMovingLinkTitle] = useState("");

  const { data: linksResponse, isLoading: isLinksLoading } = useGetLinks();
  const { mutate: createLink, isPending: isCreatingLink } = useCreateLink();
  const { mutate: updateLink, isPending: isUpdatingLink } = useUpdateLink();
  const { mutate: deleteLink, isPending: isDeletingLink } = useDeleteLink();
  const { mutate: reorderLinks } = useReorderLinks();
  const { mutate: createGroup, isPending: isCreatingGroup } = useCreateGroup();
  const { mutate: renameGroup, isPending: isRenamingGroup } = useRenameGroup();
  const { mutate: deleteGroupMutate, isPending: isDeletingGroup } = useDeleteGroup();
  const { mutate: moveLink, isPending: isMovingLink } = useMoveLink();

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
    setAddLinkGroupId(null);
  };

  const resetEditLinkForm = () => {
    setEditingLinkId(null);
    setEditTitleInput("");
    setEditUrlInput("");
    setEditIconDataUrl("");
    setEditIconFile(null);
    setIsEditIconUploading(false);
    setEditIconInputKey((value) => value + 1);
    setEditLinkGroupId(null);
  };

  const resetDeleteLinkForm = () => {
    setDeletingLinkId(null);
  };

  const resetDragState = () => {
    setDraggingLinkId(null);
    setDragOverLinkId(null);
  };

  const handleCreateGroup = (name: string) => {
    createGroup(
      { name },
      {
        onSuccess: () => {
          toast.success("Group created successfully");
          setShowCreateGroupModal(false);
        },
        onError: (error: unknown) => {
          toast.error(
            getApiErrorMessage(error, "Failed to create group. Please try again.")
          );
        },
      }
    );
  };

  const handleRenameGroup = (groupId: string) => {
    setRenamingGroupId(groupId);
    setShowRenameGroupModal(true);
  };

  const handleRenameGroupSubmit = (newName: string) => {
    if (!renamingGroupId) return;

    renameGroup(
      { id: renamingGroupId, data: { name: newName } },
      {
        onSuccess: () => {
          toast.success("Group renamed successfully");
          setShowRenameGroupModal(false);
          setRenamingGroupId(null);
        },
        onError: (error: unknown) => {
          toast.error(
            getApiErrorMessage(error, "Failed to rename group. Please try again.")
          );
        },
      }
    );
  };

  const handleDeleteGroup = (groupId: string) => {
    setDeletingGroupId(groupId);
    setShowDeleteGroupModal(true);
  };

  const handleDeleteGroupConfirm = () => {
    if (!deletingGroupId) return;

    deleteGroupMutate(deletingGroupId, {
      onSuccess: () => {
        toast.success("Group deleted and links ungrouped");
        setShowDeleteGroupModal(false);
        setDeletingGroupId(null);
      },
      onError: (error: unknown) => {
        toast.error(
          getApiErrorMessage(error, "Failed to delete group. Please try again.")
        );
      },
    });
  };

  const handleMoveLink = (linkId: string, linkTitle: string) => {
    setMovingLinkId(linkId);
    setMovingLinkTitle(linkTitle);
    setShowMoveToGroupModal(true);
  };

  const handleMoveLinkSubmit = (groupId: string | null) => {
    if (!movingLinkId) return;

    moveLink(
      { id: movingLinkId, groupId },
      {
        onSuccess: () => {
          toast.success("Link moved successfully");
          setShowMoveToGroupModal(false);
          setMovingLinkId(null);
          setMovingLinkTitle("");
        },
        onError: (error: unknown) => {
          toast.error(
            getApiErrorMessage(error, "Failed to move link. Please try again.")
          );
        },
      }
    );
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
        groupId: addLinkGroupId || undefined,
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
    setEditLinkGroupId(link.groupId || null);
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
          groupId: editLinkGroupId || null,
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
      <div className="flex-1 px-6 md:px-10 grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* Left column */}
        <div className="py-10">
          {/* Profile */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden relative flex items-center justify-center">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt={fullName}
                  fill
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

          {/* Add link and Create Group buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setShowAddLinkModal(true)}
              className="flex-1 bg-[#111827] text-white py-4 rounded-xl"
            >
              + Add Link
            </button>
            <button
              onClick={() => setShowCreateGroupModal(true)}
              className="flex-1 border border-gray-300 text-gray-900 py-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              + Create Group
            </button>
          </div>

          {/* Links list with grouping */}
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
            <div className="space-y-6">
              {(() => {
                const groups = linksResponse?.groups || [];
                const { grouped, ungrouped } = groupLinksByGroup(links, groups);

                return (
                  <>
                    {/* Grouped links */}
                    {grouped.map(({ group, links: groupLinks }) => (
                      <div key={group.id}>
                        <LinkGroupHeader
                          groupName={group.name}
                          linkCount={groupLinks.length}
                          onRename={() => handleRenameGroup(group.id)}
                          onDelete={() => handleDeleteGroup(group.id)}
                          isLoading={isRenamingGroup || isDeletingGroup}
                        />
                        <div className="space-y-3 mt-3">
                          {groupLinks.map((link: LinkItem) => (
                            <div
                              key={link.id || `${link.title}-${link.url}`}
                              draggable={Boolean(link.id)}
                              onDragStart={() =>
                                link.id && handleDragStart(link.id)
                              }
                              onDragOver={(event) =>
                                link.id && handleDragOver(event, link.id)
                              }
                              onDrop={(event) =>
                                link.id && handleDrop(event, link.id)
                              }
                              onDragEnd={resetDragState}
                              className={`bg-white rounded-xl border p-4 flex items-center justify-between transition-colors ${
                                dragOverLinkId === link.id &&
                                draggingLinkId !== link.id
                                  ? "border-[#111827]"
                                  : "border-gray-200"
                              } ${draggingLinkId === link.id ? "opacity-60" : ""}`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center lg:gap-x-10 gap-x-4 cursor-grab">
                                  <Grip size={20} color="#B3B5B4" />
                                  <div>
                                    <div className="flex items-center gap-x-3">
                                      {link.icon ? (
                                        <Image
                                          src={link.icon || ""}
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
                                        onClick={() =>
                                          openEditLinkModal(link)
                                        }
                                        aria-label={`Edit ${link.title}`}
                                        className="rounded p-1 hover:bg-gray-100"
                                      >
                                        <Pencil size={16} color="#000000" />
                                      </button>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[200px] sm:max-w-xs md:max-w-md pt-2">
                                      {link.url}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleMoveLink(link.id || "", link.title)
                                    }
                                    aria-label={`Move ${link.title}`}
                                    className="rounded p-1 hover:bg-blue-50"
                                    title="Move to group"
                                  >
                                    <svg
                                      width="20"
                                      height="20"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                      className="text-blue-600"
                                    >
                                      <path d="M19 12h-2v-2h-2v2h-2v2h2v2h2v-2h2v-2zm-8-6H9v2H7V6h4zm0 6H9v2H7v-2h4zm0 6H9v2H7v-2h4zM19 6v4h2V6h-2z" />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openDeleteLinkModal(link)
                                    }
                                    aria-label={`Delete ${link.title}`}
                                    className="rounded p-1 hover:bg-red-50"
                                  >
                                    <Trash size={20} color="#000000" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Ungrouped links */}
                    {ungrouped.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                          Ungrouped
                        </h3>
                        <div className="space-y-3">
                          {ungrouped.map((link: LinkItem) => (
                            <div
                              key={link.id || `${link.title}-${link.url}`}
                              draggable={Boolean(link.id)}
                              onDragStart={() =>
                                link.id && handleDragStart(link.id)
                              }
                              onDragOver={(event) =>
                                link.id && handleDragOver(event, link.id)
                              }
                              onDrop={(event) =>
                                link.id && handleDrop(event, link.id)
                              }
                              onDragEnd={resetDragState}
                              className={`bg-white rounded-xl border p-4 flex items-center justify-between transition-colors ${
                                dragOverLinkId === link.id &&
                                draggingLinkId !== link.id
                                  ? "border-[#111827]"
                                  : "border-gray-200"
                              } ${draggingLinkId === link.id ? "opacity-60" : ""}`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center lg:gap-x-10 gap-x-4 cursor-grab">
                                  <Grip size={20} color="#B3B5B4" />
                                  <div>
                                    <div className="flex items-center gap-x-3">
                                      {link.icon ? (
                                        <Image
                                          src={link.icon || ""}
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
                                        onClick={() =>
                                          openEditLinkModal(link)
                                        }
                                        aria-label={`Edit ${link.title}`}
                                        className="rounded p-1 hover:bg-gray-100"
                                      >
                                        <Pencil size={16} color="#000000" />
                                      </button>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[200px] sm:max-w-xs md:max-w-md pt-2">
                                      {link.url}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleMoveLink(link.id || "", link.title)
                                    }
                                    aria-label={`Move ${link.title}`}
                                    className="rounded p-1 hover:bg-blue-50"
                                    title="Move to group"
                                  >
                                    <svg
                                      width="20"
                                      height="20"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                      className="text-blue-600"
                                    >
                                      <path d="M19 12h-2v-2h-2v2h-2v2h2v2h2v-2h2v-2zm-8-6H9v2H7V6h4zm0 6H9v2H7v-2h4zm0 6H9v2H7v-2h4zM19 6v4h2V6h-2z" />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openDeleteLinkModal(link)
                                    }
                                    aria-label={`Delete ${link.title}`}
                                    className="rounded p-1 hover:bg-red-50"
                                  >
                                    <Trash size={20} color="#000000" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
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

          {/* Floating Preview Button Bar - Mobile */}
          <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 px-6 py-4">
            <button
              onClick={() => setShowPreviewModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-900 font-medium py-3 rounded-xl transition-colors"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 5C7 5 2.73 8.11 1 12.46c1.73 4.35 6 7.54 11 7.54s9.27-3.19 11-7.54C21.27 8.11 17 5 12 5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                  fill="currentColor"
                />
              </svg>
              Preview
            </button>
          </div>

          {/* Add bottom padding to account for floating button */}
          <div className="md:hidden h-20" />
        </div>

        {/* Right preview */}
        <div className="hidden xl:flex border-l py-5  border-[#EBEBEB] pl-12 flex-col items-center gap-6">
          <button
            onClick={() => setShowShareProfileModal(true)}
            className="border max-w-fit gap-x-3 hover:shadow rounded-lg border-gray-200 px-2 py-2 flex items-center"
          >
            <p className="text-[#1B231F]">
              cardconnect/{user?.username || "username"}
            </p>
            <button
              className="text-gray-600 hover:bg-gray-200 p-2 rounded-lg transition-colors"
              aria-label="Share"
            >
              <ShareIcon size={18} color="#1D1F2C" />
            </button>
          </button>
          {/* Phone-framed preview using ProfileRenderer */}
          <PhoneFrame>
            <ProfileRenderer
              user={{
                fullName,
                bio,
                profileImage,
                username: user?.username,
              }}
              links={links}
              socialLinks={useDesignStore((state) => state.socialLinksDraft)}
              design={user?.design || DEFAULT_PROFILE_DESIGN}
            />
          </PhoneFrame>
        </div>
      </div>

      <AddLinkModal
        open={showAddLinkModal}
        titleInput={titleInput}
        urlInput={urlInput}
        iconPreview={addIconDataUrl}
        fileInputKey={addIconInputKey}
        isCreatingLink={isCreatingLink || isAddIconUploading}
        groups={linksResponse?.groups}
        selectedGroupId={addLinkGroupId}
        onTitleChange={setTitleInput}
        onUrlChange={setUrlInput}
        onIconFileChange={handleAddIconFileChange}
        onGroupChange={setAddLinkGroupId}
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
        groups={linksResponse?.groups}
        selectedGroupId={editLinkGroupId}
        onTitleChange={setEditTitleInput}
        onUrlChange={setEditUrlInput}
        onIconFileChange={handleEditIconFileChange}
        onGroupChange={setEditLinkGroupId}
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

      {showPreviewModal && (
        <PreviewLinkModal
          show={showPreviewModal}
          setShowPreviewModal={setShowPreviewModal}
          profileImage={profileImage}
          fullName={fullName}
          bio={bio}
          links={links}
          username={user?.username}
          openShareLinkModal={openShareLinkModal}
          initial={initial}
          setShowShareProfileModal={setShowShareProfileModal}
        />
      )}

      {showShareProfileModal && (
        <ShareProfileModal
          open={showShareProfileModal}
          profileUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/${user?.username || "username"}`}
          fullName={fullName}
          onClose={() => setShowShareProfileModal(false)}
          onCopy={() => {
            navigator.clipboard.writeText(
              `${typeof window !== "undefined" ? window.location.origin : ""}/${user?.username || "username"}`,
            );
            toast.success("Link copied to clipboard!");
          }}
        />
      )}

      <CreateGroupModal
        open={showCreateGroupModal}
        isLoading={isCreatingGroup}
        onClose={() => setShowCreateGroupModal(false)}
        onSubmit={handleCreateGroup}
      />

      <RenameGroupModal
        open={showRenameGroupModal}
        currentName={
          renamingGroupId && linksResponse?.groups
            ? linksResponse.groups.find((g) => g.id === renamingGroupId)
                ?.name || ""
            : ""
        }
        isLoading={isRenamingGroup}
        onClose={() => {
          setShowRenameGroupModal(false);
          setRenamingGroupId(null);
        }}
        onSubmit={handleRenameGroupSubmit}
      />

      <DeleteGroupModal
        open={showDeleteGroupModal}
        groupName={
          deletingGroupId && linksResponse?.groups
            ? linksResponse.groups.find((g) => g.id === deletingGroupId)
                ?.name || ""
            : ""
        }
        isLoading={isDeletingGroup}
        onClose={() => {
          setShowDeleteGroupModal(false);
          setDeletingGroupId(null);
        }}
        onConfirm={handleDeleteGroupConfirm}
      />

      <MoveToGroupModal
        open={showMoveToGroupModal}
        linkTitle={movingLinkTitle}
        groups={linksResponse?.groups || []}
        selectedGroupId={
          movingLinkId && links
            ? links.find((l) => l.id === movingLinkId)?.groupId
            : undefined
        }
        isLoading={isMovingLink}
        onClose={() => {
          setShowMoveToGroupModal(false);
          setMovingLinkId(null);
          setMovingLinkTitle("");
        }}
        onSubmit={handleMoveLinkSubmit}
      />
    </div>
  );
};

export default MyLink;
