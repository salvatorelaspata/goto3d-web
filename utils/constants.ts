import { FieldProps } from "@/components/forms/Form";
export type itemHeaderProps = {
  name: string;
  url: string;
};

export const privateRoutes: itemHeaderProps[] = [
  {
    name: "Dashboard",
    url: "/dashboard",
  },
  {
    name: "Progetti",
    url: "/projects",
  },
  {
    name: "Cataloghi",
    url: "/catalogs",
  },
];
export const publicRoutes: itemHeaderProps[] = [];

export const formFields: FieldProps[] = [
  {
    id: "formName",
    label: "Name",
    name: "name",
    type: "text",
  },
  {
    id: "formDescription",
    label: "Description",
    name: "description",
    type: "textarea",
  },
  {
    id: "formFiles",
    label: "Files",
    name: "files",
    type: "file",
    multiple: true,
  },
  {
    id: "formDetail",
    label: "Details",
    name: "detail",
    type: "radio",
    description: "The level of detail of the project",
    icon: "🧐",
    options: [
      { label: "Preview", value: "preview", description: "more fast" },
      { label: "Reduced", value: "reduced", description: "good compromise" },
      {
        label: "Medium",
        value: "medium",
        default: true,
        description: "good compromise",
      },
      { label: "Full", value: "full", description: "more accurate" },
      { label: "Raw", value: "raw", description: "original data" },
    ],
  },
  {
    id: "formOrder",
    label: "Orders",
    name: "order",
    type: "radio",
    description: "The order of the project",
    icon: "👔",
    options: [
      {
        label: "Unordered",
        value: "unordered",
        default: true,
        description: "no specific order",
      },
      {
        label: "Sequential",
        value: "sequential",
        description: "ordered by time",
      },
    ],
  },
  {
    id: "formFeature",
    label: "Features",
    name: "feature",
    type: "radio",
    description: "The features of the project",
    icon: "💎",
    options: [
      {
        label: "Normal",
        value: "normal",
        default: true,
        description: "no specific feature",
      },
      { label: "High", value: "high", description: "more features" },
    ],
  },
];

export const filesToTable = (files: FileList, project_id?: number) => {
  return Array.from(files || []).map((file) => {
    return {
      file_name: file.name,
      mime_type: file.type,
      size: file.size,
      ...(project_id && { project_id: project_id }),
    };
  });
};
