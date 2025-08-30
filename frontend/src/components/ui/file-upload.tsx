import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [hoverEnabled, setHoverEnabled] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    const first = newFiles?.[0];
    if (!first) return;
    setFiles([first]);
    onChange?.([first]);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onChange?.([]);
    setHoverEnabled(false);
    setTimeout(() => setHoverEnabled(true), 80);
  };

  const handleClick = () => fileInputRef.current?.click();

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => console.log(error),
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover={hoverEnabled ? "animate" : undefined}
        className="group/file block cursor-pointer w-full relative overflow-visible"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-200 text-base">
            Upload your resume
          </p>
          <p className="relative z-20 font-sans text-neutral-400 text-sm mt-1">
            Drag & drop or click to upload (max 1 file)
          </p>

          {/* tightened spacing here */}
          <div className="relative w-full mt-4 max-w-xl mx-auto">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId="file-pill"
                  className={cn(
                    "relative overflow-hidden z-40 flex flex-col justify-center w-full max-w-md mx-auto mt-2",
                    "rounded-lg px-3 py-2",
                    "before:content-[''] before:absolute before:inset-0 before:rounded-lg before:p-[1.5px]",
                    "before:bg-gradient-to-r before:from-[#5FA4E6] before:to-[#BA2193]",
                    "after:content-[''] after:absolute after:inset-[2px] after:rounded-md after:bg-neutral-900",
                    "shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
                  )}
                >
                  <button
                    type="button"
                    onClick={handleRemove}
                    onClickCapture={(e) => e.stopPropagation()}
                    onPointerDownCapture={(e) => e.stopPropagation()}
                    className="absolute right-1.5 top-1.5 z-50 text-[11px] px-2 py-0.5 rounded-md
                               border border-white/10 bg-neutral-800/80 text-neutral-300
                               hover:bg-neutral-700 hover:text-white transition"
                  >
                    Remove
                  </button>

                  <div className="relative z-10 flex justify-between w-full items-center gap-3 pr-14">
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout className="text-sm text-neutral-300 truncate max-w-xs">
                      {file.name}
                    </motion.p>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout className="rounded-md px-2 py-0.5 text-xs bg-neutral-800 text-white">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                  </div>

                  <div className="relative z-10 mt-1 flex items-center justify-between text-[11px] text-neutral-400 pr-14">
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout className="px-1 py-0.5 rounded bg-neutral-800/70">
                      {file.type || "—"}
                    </motion.p>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
                      modified {new Date(file.lastModified).toLocaleDateString()}
                    </motion.p>
                  </div>
                </motion.div>
              ))}

            {!files.length && (
              <motion.div
                layoutId="upload-cell"
                variants={mainVariant}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  // ↓ smaller: was h-32 w-32
                  "relative z-40 flex items-center justify-center h-28 w-28 mx-auto",
                  "rounded-xl bg-neutral-900/90 backdrop-blur-sm",
                  "border border-white/15",
                  "transition-all duration-300 hover:scale-105",
                  "shadow-[0_10px_40px_rgba(0,0,0,0.45)]",
                  "hover:shadow-[0_0_40px_rgba(95,164,230,0.35),0_0_70px_rgba(186,33,147,0.35)]",
                  "before:content-[''] before:absolute before:inset-0 before:rounded-xl before:p-[1.5px]",
                  "before:bg-gradient-to-br before:from-[#5FA4E6] before:to-[#BA2193] before:opacity-0 hover:before:opacity-100",
                  "after:content-[''] after:absolute after:inset-[2px] after:rounded-[12px] after:bg-neutral-900/95"
                )}
              >
                {isDragActive ? (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-neutral-200 flex flex-col items-center">
                    Drop it
                    {/* ↓ icon a touch smaller to match */}
                    <IconUpload className="h-5 w-5 mt-1 text-white" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-5 w-5 z-10 text-white" />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                // ↓ keep overlay dimensions in sync
                className="absolute inset-0 z-30 h-28 w-28 mx-auto rounded-xl opacity-0
                           group-hover/file:opacity-100 bg-gradient-to-br from-[#5FA4E6]/20 to-[#BA2193]/20 pointer-events-none"
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};







