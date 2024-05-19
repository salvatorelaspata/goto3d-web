import { useState } from "react";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { RadioGroup } from "./_RadioGroup";
import { Select } from "./_Select";
import { InputFile } from "./_InputFile";

export interface FieldProps {
  id: string;
  label: string;
  description?: string;
  name: string;
  type: "text" | "textarea" | "select" | "file" | "radio" | "password";
  disabled?: boolean;
  value?: string;
  icon?: string; // for radio
  options?: {
    label: string;
    value: string;
    description?: string;
    default?: boolean;
  }[]; // for select
  multiple?: boolean; // for file
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onFileChange?: (e: React.ChangeEvent<FileEventTarget>) => void;
}

type FileEventTarget = HTMLInputElement & { files: FileList };
