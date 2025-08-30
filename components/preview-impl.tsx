"use client";

import React from "react";

interface PreviewProps {
  value: string;
}

export const PreviewImpl = ({ value }: PreviewProps) => {
  return (
    <div
      className="bg-slate-50 border rounded-md p-2 min-h-[150px] prose max-w-none"
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};
