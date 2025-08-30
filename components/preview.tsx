"use client";

import dynamic from "next/dynamic";

export const Preview = dynamic(
  () => import("./preview-impl").then((m) => m.PreviewImpl),
  { ssr: false }
);
