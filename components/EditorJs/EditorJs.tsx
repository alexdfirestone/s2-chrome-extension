"use client"

import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import List from "@editorjs/list";
import Underline from "@editorjs/underline";
import CustomTable from './CustomTable'
import Paragraph from "@editorjs/paragraph";
import CustomImage from './CustomImage'

// import SimpleImage from "@editorjs/simple-image";
// import TableIcon from "@radix-ui/react-icons/dist/TableIcon";
// import SimpleImage from "@editorjs/simple-image";

// Add interface for Editor props
interface EditorProps {
  data: any; // You can make this more specific based on your data structure
  onChange: (data: any) => void;
  holder: string;
  readOnly?: boolean; // Add readonly prop
  placeholder?: string; // Added for AnswerTextArea compatibility
  style?: React.CSSProperties; // Added for custom styling
  backgroundColor?: string; // Add this prop
  version?: number;  // Add this prop to track external updates
  minHeight?: string | number; // Add this prop
}

// Add type for EDITOR_TOOLS (remains mostly the same, just adding type annotation)
const EDITOR_TOOLS: Record<string, any> = {
//   code: Code,
//   header: {
//     class: Header,
//     shortcut: "CMD+H",
//     inlineToolbar: true,
//     config: {
//       placeholder: "Enter a Header",
//       levels: [2, 3, 4],
//       defaultLevel: 2,
//     },
//   },
  paragraph: {
    class: Paragraph,
    // shortcut: 'CMD+P',
    inlineToolbar: true,
  },
//   checklist: CheckList,
//   inlineCode: InlineCode,
    table: {
        class: CustomTable,
        inlineToolbar: true,
        withHeadings: true,
        config: {
            rows: 3,
            cols: 2, 
        },
        // Add focus event listener for the table cells
        onFocus: (event: FocusEvent) => {
            const target = event.target as HTMLElement;
            if (target && target.tagName === "TD") { // Check if the focused element is a cell
            const row = target.parentElement ? Array.from(target.parentElement.children).indexOf(target) : -1;
            const col = target ? Array.from(target.parentNode!.children).indexOf(target) : -1;
            console.log(`Focused cell: Row ${row}, Column ${col}`);
            }
      }
  },
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      defaultStyle: 'unordered', // Default style remains 'unordered'
    },
  },
//   quote: Quote,
//   delimiter: Delimiter,
//   raw: Raw,
  underline: {
    class: Underline,
    inlineToolbar: true,
  },
  image: {
    class: CustomImage,
    inlineToolbar: true,
  },
};

function Editor({ data, onChange, holder, readOnly = false, placeholder, style, backgroundColor = '#fff', version = 0, minHeight = "250px" }: EditorProps) {
  const ref = useRef<EditorJS | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const isExternalUpdate = useRef(false);

  // First useEffect - Initialization
  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        placeholder: placeholder || "Start writing here..",
        tools: EDITOR_TOOLS,
        data,
        readOnly,
        async onChange(api, event) {
          if (!isExternalUpdate.current) {  // Only trigger onChange if it's not an external update
            const content = await api.saver.save();
            onChange(content);
          }
        },
      });
      ref.current = editor;
      
      editor.isReady.then(() => {
        setIsInitialized(true);
      });
    }

    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);

  // Modified second useEffect to only run on version changes
  useEffect(() => {
    if (ref.current && isInitialized) {
      isExternalUpdate.current = true;
      ref.current.render(data).then(() => {
        isExternalUpdate.current = false;
      });
    }
  }, [version, isInitialized]);

  return (
    <div
      id={holder}
      style={{
        width: "100%",
        borderRadius: "7px",
        background: backgroundColor,
        minHeight: minHeight,
        ...style,
      }}
    />
  );
}

// Update interface for EditorContainer props
interface EditorContainerProps {
  readOnly?: boolean;
  value?: any;
  onChange: (data: any) => void;
  placeholder?: string;
  externalUpdate?: number;
  uniqueId?: string;
  backgroundColor?: string;
  minHeight?: string | number;
}

// Update EditorContainer component
const EditorContainer: React.FC<EditorContainerProps> = ({ 
  readOnly = false,
  value,
  onChange,
  placeholder = "Start writing here..",
  externalUpdate = 0,
  uniqueId = 'default',
  backgroundColor = 'transparent',
  minHeight = "250px",
}) => {
  const holderId = `editorjs-container-${uniqueId}`;

  return (
    <>
      <style>{`
        /* Target specific instance using holderId */
        #${holderId} .ce-block__content {
          max-width: none !important;
          background-color: transparent !important;
        }
        
        /* Adjust toolbar positioning */
        #${holderId} .ce-toolbar__settings-btn {
          margin-right: 2px !important;
        }

        #${holderId} .ce-toolbar__plus {
          margin-right: -8px !important;
        }

        /* Make toolbar buttons more compact */
        #${holderId} .ce-toolbar__actions {
          display: flex !important;
          gap: -6px !important;
        }

        #${holderId} .codex-editor__redactor {
          padding-bottom: 0 !important;
        }

        #${holderId} .ce-paragraph.cdx-block,
        #${holderId} .tc-cell,
        #${holderId} .cdx-list .cdx-list__item {
          font-size: 14px;
        }

        #${holderId} .codex-editor,
        #${holderId} .codex-editor--narrow,
        #${holderId} .codex-editor--empty {
          background-color: transparent !important;
        }

        #${holderId} .custom-image-block {
          padding: 10px 0;
        }

        #${holderId} .custom-image-container {
          margin: 10px 0;
        }

        #${holderId} .custom-image {
          max-width: 100%;
          height: auto;
          display: block;
          border-radius: 4px;
        }

        #${holderId} .image-upload-button {
          padding: 8px 16px;
          background-color: #f3f4f6;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        #${holderId} .image-upload-button:hover {
          background-color: #e5e7eb;
        }
      `}</style>
      <div className="flex flex-col w-full mx-auto relative" style={{ overflow: 'visible' }}>
        <div className="relative w-full pl-8 pr-2 py-4" style={{ overflow: 'visible' }}>
          <Editor 
            onChange={onChange} 
            data={value} 
            holder={holderId}
            readOnly={readOnly}
            placeholder={placeholder}
            version={externalUpdate}
            backgroundColor={backgroundColor}
            minHeight={minHeight}
          />
        </div>
      </div>
    </>
  );
};

// Add new interface for ViewOnlyEditorContainer props
interface ViewOnlyEditorContainerProps {
  value: any;
  placeholder?: string;
  uniqueId?: string; // Add uniqueId prop
  backgroundColor?:  string
  minHeight?: string | number;
}

// Add ViewOnlyEditorContainer component
const ViewOnlyEditorContainer: React.FC<ViewOnlyEditorContainerProps> = ({ 
  value,
  placeholder = "No content to display",
  uniqueId = 'default',
  backgroundColor = 'transparent',
  minHeight = "250px",
}) => {
  const holderId = `editorjs-viewer-${uniqueId}`;

  return (
    <>
      <style>{`
        /* Override EditorJS content blocks */
        #${holderId} .ce-block__content {
          max-width: none !important;
          background-color: transparent !important;
        }
        
        /* Override EditorJS redactor padding */
        #${holderId} .codex-editor__redactor {
          padding-bottom: 0 !important;
        }

        /* Override paragraph and table cell font size */
        #${holderId} .ce-paragraph.cdx-block,
        #${holderId} .tc-cell,
        #${holderId} .cdx-list .cdx-list__item {
          font-size: 14px !important;
        }

        /* Override EditorJS background for various states */
        #${holderId} .codex-editor,
        #${holderId} .codex-editor--narrow,
        #${holderId} .codex-editor--empty {
          background-color: transparent !important;
        }
      `}</style>
      <div className="w-full">
        <Editor 
          onChange={() => {}}
          data={value}
          holder={holderId}
          readOnly={true}
          placeholder={placeholder}
          backgroundColor="transparent"
          minHeight={minHeight}
        />
      </div>
    </>
  );
};

export { EditorContainer, ViewOnlyEditorContainer };





