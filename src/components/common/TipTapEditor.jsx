import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  RemoveFormatting,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { uploadBeritaImage, formatImageUrl, fileToDataUrl } from "../../services/beritaService";

function ToolbarButton({ onClick, isActive = false, disabled = false, children, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? "bg-brand-100 text-brand-700 font-semibold"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}

export default function TipTapEditor({ content, onChange, placeholder = "Tulis isi berita di sini..." }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-brand-600 underline font-medium hover:text-brand-800",
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: "max-w-full rounded-xl my-4 shadow-sm",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[220px] p-4 text-gray-800",
      },
    },
  });

  // Sync content if changed externally (e.g. edit mode reset)
  useEffect(() => {
    if (editor && content !== undefined && editor.getHTML() !== content) {
      if (editor.getHTML() === "<p></p>" && !content) return;
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Masukkan URL tautan:", previousUrl);

    // cancelled
    if (url === null) return;

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      try {
        const res = await uploadBeritaImage(file);
        if (res.url) {
          const resolvedUrl = formatImageUrl(res.url);
          editor.chain().focus().setImage({ src: resolvedUrl, alt: file.name }).run();
          return;
        }
      } catch (uploadErr) {
        console.warn("Upload backend failed, falling back to data URL", uploadErr);
      }

      // Fallback: convert to compressed WebP data URL
      const dataUrl = await fileToDataUrl(file);
      editor.chain().focus().setImage({ src: dataUrl, alt: file.name }).run();
    } catch (err) {
      alert("Gagal memproses gambar: " + err.message);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-brand-500/30 focus-within:border-brand-500 transition">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Tebal (Ctrl+B)"
        >
          <Bold size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Miring (Ctrl+I)"
        >
          <Italic size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Coret"
        >
          <Strikethrough size={16} />
        </ToolbarButton>

        <div className="w-[1px] h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </ToolbarButton>

        <div className="w-[1px] h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Daftar Poin"
        >
          <List size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Daftar Angka"
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Kutipan"
        >
          <Quote size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Garis Pemisah"
        >
          <Minus size={16} />
        </ToolbarButton>

        <div className="w-[1px] h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={setLink}
          isActive={editor.isActive("link")}
          title="Tautan / Link"
        >
          <LinkIcon size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          title={isUploading ? "Mengunggah gambar..." : "Sisipkan Gambar"}
        >
          {isUploading ? (
            <div className="w-4 h-4 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin" />
          ) : (
            <ImageIcon size={16} />
          )}
        </ToolbarButton>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          disabled={isUploading}
          className="hidden"
        />

        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          title="Hapus Format"
        >
          <RemoveFormatting size={16} />
        </ToolbarButton>

        <div className="w-[1px] h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={16} />
        </ToolbarButton>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
