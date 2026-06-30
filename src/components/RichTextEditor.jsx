import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List } from 'lucide-react'
import { colors, tint } from './landing/theme'

export default function RichTextEditor({ value, onChange, placeholder, minHeight = 100, maxHeight, showToolbar = true }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  if (!editor) return null

  const btnStyle = (active) => ({
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 30, height: 30, borderRadius: 8,
    border: `1px solid ${active ? tint(colors.gold, 40) : tint(colors.gold, 14)}`,
    background: active ? tint(colors.gold, 16) : tint(colors.navy, 60),
    color: active ? colors.gold : colors.textMuted,
    cursor: 'pointer',
  })

  return (
    <div className="rte-wrap">
      {showToolbar && (
        <div className="rte-toolbar">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            style={btnStyle(editor.isActive('bold'))}
            aria-label="Bold"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            style={btnStyle(editor.isActive('italic'))}
            aria-label="Italic"
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            style={btnStyle(editor.isActive('bulletList'))}
            aria-label="Bullet list"
          >
            <List size={14} />
          </button>
        </div>
      )}
      <EditorContent
        editor={editor}
        className="rte-content"
        style={{
          '--rte-min-height': `${minHeight}px`,
          '--rte-max-height': maxHeight ? `${maxHeight}px` : 'none',
        }}
      />
    </div>
  )
}
