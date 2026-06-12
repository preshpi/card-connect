"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useBuilderStore } from "@/app/store/useBuilderStore";
import { CODE_THEMES, PATTERNS } from "@/app/utils/general";

interface TemplateSnapshot {
  id: string;
  name: string;
  createdAt: string;
  source: "builder-storage";
  builderState: {
    selectedTemplate?: "code" | "plain" | null;
    fullName?: string;
    role?: string;
    email?: string;
    link?: string;
    availableForJob?: string;
    theme?: string;
    plainCardValues?: {
      pattern?: string;
      patternOpacity?: number;
      bgColor?: string;
      hasLogo?: "yes" | "no";
      logoFile?: File | string | null;
      imageSize?: number;
      logoPosition?: "top" | "bottom" | "left" | "right" | "center";
      logoSpacing?: number;
      text?: string;
      fontSize?: string;
      fontWidth?: string;
      fontFamily?: string;
      link?: string;
    };
  };
}

interface TemplateStore {
  order: string[];
  byId: Record<string, TemplateSnapshot>;
}

const TEMPLATE_STORAGE_KEY = "card-connect-templates";

const TemplateFrontPreview = ({ template }: { template: TemplateSnapshot }) => {
  const state = template.builderState;
  const selectedTemplate = state.selectedTemplate ?? "code";

  if (selectedTemplate === "plain") {
    const plain = state.plainCardValues;
    const pattern = PATTERNS.find((item) => item.id === plain?.pattern);

    return (
      <div
        className="mb-4 aspect-[1.6/1] w-full overflow-hidden rounded-xl border border-black/5 p-4"
        style={{
          backgroundColor: plain?.bgColor ?? "#1d2f25",
          color: "#ffffff",
        }}
      >
        {pattern ? (
          <div
            className="absolute"
            style={{
              inset: 0,
              opacity: (plain?.patternOpacity ?? 30) / 100,
              backgroundImage: pattern.css,
              backgroundSize: pattern.size ?? "20px 20px",
              pointerEvents: "none",
            }}
          />
        ) : null}

        <div className="relative z-10 flex h-full flex-col justify-between">
          <p className="line-clamp-2 text-sm font-semibold">
            {plain?.text || state.fullName || "Your plain card"}
          </p>
          <p className="truncate text-xs opacity-90">
            {plain?.link || state.link || "https://example.com"}
          </p>
        </div>
      </div>
    );
  }

  const activeTheme =
    CODE_THEMES[state.theme ?? "vscode"] ?? CODE_THEMES.vscode;

  return (
    <div
      className="mb-4 aspect-[1.6/1] w-full overflow-hidden rounded-xl border border-black/5 p-4 font-mono"
      style={{ backgroundColor: activeTheme.bg, color: activeTheme.text }}
    >
      <div className="mb-4 flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
      </div>

      <div
        className="mb-1 text-[10px]"
        style={{ color: activeTheme.tokens.comment }}
      >
        {"// Preview"}
      </div>

      <div className="space-y-1 text-[10px] leading-4 sm:text-xs sm:leading-5">
        <p>
          <span style={{ color: activeTheme.tokens.key }}>name</span>
          <span style={{ color: activeTheme.tokens.text }}>: </span>
          <span style={{ color: activeTheme.tokens.string }}>
            {`"${state.fullName || "@username"}"`}
          </span>
        </p>
        <p>
          <span style={{ color: activeTheme.tokens.key }}>role</span>
          <span style={{ color: activeTheme.tokens.text }}>: </span>
          <span style={{ color: activeTheme.tokens.string }}>
            {`"${state.role || "developer"}"`}
          </span>
        </p>
        <p>
          <span style={{ color: activeTheme.tokens.key }}>email</span>
          <span style={{ color: activeTheme.tokens.text }}>: </span>
          <span
            className="truncate"
            style={{ color: activeTheme.tokens.string }}
          >
            {`"${state.email || "mail@example.com"}"`}
          </span>
        </p>
        <p>
          <span style={{ color: activeTheme.tokens.key }}>availableForJob</span>
          <span style={{ color: activeTheme.tokens.text }}>: </span>
          <span
            className="truncate"
            style={{ color: activeTheme.tokens.string }}
          >
            {`"${state.availableForJob || "No"}"`}
          </span>
        </p>
      </div>
    </div>
  );
};

const Template = () => {
  const router = useRouter();
  const { setTemplate, setDetails, setPlainDetails } = useBuilderStore();
  const [templateStore] = useState<TemplateStore>(() => {
    const raw = localStorage?.getItem(TEMPLATE_STORAGE_KEY);

    if (!raw) {
      return { order: [], byId: {} };
    }

    try {
      return JSON.parse(raw) as TemplateStore;
    } catch {
      return { order: [], byId: {} };
    }
  });

  const orderedTemplates = templateStore.order
    .map((id) => templateStore.byId[id])
    .filter(Boolean);

  const handleUseTemplate = (template: TemplateSnapshot) => {
    const state = template.builderState;
    const selectedTemplate = state.selectedTemplate ?? "code";

    setTemplate(selectedTemplate);
    setDetails({
      fullName: state.fullName ?? "",
      role: state.role ?? "",
      email: state.email ?? "",
      link: state.link ?? "",
      availableForJob: state.availableForJob ?? "",
      theme: state.theme ?? "vscode",
    });

    if (state.plainCardValues) {
      setPlainDetails(state.plainCardValues);
    }

    if (selectedTemplate === "code") {
      router.push("/dashboard/customize/create-codeCard");
      return;
    }

    router.push("/dashboard/customize/create-plainCard");
  };

  return (
    <div className="pt-8 pb-10 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
        <p className="text-gray-500">
          Select a saved template to continue editing from that design.
        </p>
      </div>

      {orderedTemplates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-600">
          No saved templates yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orderedTemplates.map((template) => {
            const type = template.builderState.selectedTemplate ?? "code";

            return (
              <button
                key={template.id}
                onClick={() => handleUseTemplate(template)}
                className="rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:border-[#7269E3] hover:shadow-sm"
              >
                <TemplateFrontPreview template={template} />
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="line-clamp-1 text-base font-semibold text-gray-900">
                    {template.name}
                  </h2>
                  <span className="rounded-full bg-[#EEF0FF] px-3 py-1 text-xs font-medium capitalize text-[#4E56D9]">
                    {type}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Saved {new Date(template.createdAt).toLocaleString()}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Template;
