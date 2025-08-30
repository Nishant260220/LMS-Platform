"use client";

import React from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css"; 

export type EditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export const EditorImpl = ({ value, onChange }: EditorProps) => {
  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        className="min-h-[150px]"
        modules={{
          toolbar: [
            ["bold", "italic", "underline", "strike"], 
            [{ list: "ordered" }, { list: "bullet" }],
            [{ header: [1, 2, 3, false] }],
            ["link"],
            ["clean"], 
          ],
        }}
      />
    </div>
  );
};
