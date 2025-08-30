"use client";

import dynamic from "next/dynamic";
import type { EditorProps } from "./editor-impl";

export const Editor = dynamic<EditorProps>(
  () => import("./editor-impl").then((mod) => mod.EditorImpl),
  { ssr: false }
);
