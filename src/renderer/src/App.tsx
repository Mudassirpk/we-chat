import type React from 'react'
import { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import {
  FiFileText,
  FiTrash2,
  FiEdit3,
  FiMoreVertical,
  FiBold,
  FiItalic,
  FiList,
  FiLink,
  FiCode,
  FiUnderline
} from 'react-icons/fi'

interface Note {
  _id: string
  title: string
  description: string
  createdAt: Date
}

const noteColors = [
  'bg-yellow-100 border-yellow-200',
  'bg-blue-100 border-blue-200',
  'bg-green-100 border-green-200',
  'bg-pink-100 border-pink-200',
  'bg-purple-100 border-purple-200',
  'bg-orange-100 border-orange-200',
  'bg-red-100 border-red-200',
  'bg-indigo-100 border-indigo-200'
]

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && description.trim()) {
      const newNote = {
        title: title.trim(),
        description: description.trim()
      }
      const res = await window.context.note_add(newNote)
      if (res.success) {
        setNotes([res.data as any, ...notes])
        setTitle('')
        setDescription('')
        if (editorRef.current) {
          editorRef.current.innerHTML = ''
        }
        setIsExpanded(false)
        toast.success('Note added successfully')
      } else {
        toast.error('Failed to create note')
      }
    }
  }

  async function getNotes() {
    const res = await window.context.note_all()
    console.log(res)
    setNotes(res.data as any)
  }

  useEffect(() => {
    getNotes()
  }, [])

  const deleteNote = async (id: string) => {
    const res = await window.context.note_delete(id)
    if (res.success) {
      setNotes(notes.filter((note) => note._id !== id))
      toast.success('Note deleted successfully')
    } else {
      toast.error('Failed to delete note')
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRandomColor = (index: number) => {
    return noteColors[index % noteColors.length]
  }

  // WYSIWYG formatting functions
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const formatBold = () => execCommand('bold')
  const formatItalic = () => execCommand('italic')
  const formatUnderline = () => execCommand('underline')

  const formatCode = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const selectedText = range.toString()

      if (selectedText) {
        const codeElement = document.createElement('code')
        codeElement.className = 'bg-gray-200 px-1 py-0.5 rounded text-sm font-mono'
        codeElement.textContent = selectedText

        range.deleteContents()
        range.insertNode(codeElement)

        // Clear selection
        selection.removeAllRanges()
        editorRef.current?.focus()
      }
    }
  }

  const formatLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      execCommand('createLink', url)
    }
  }

  const formatList = () => execCommand('insertUnorderedList')

  const handleEditorInput = () => {
    if (editorRef.current) {
      setDescription(editorRef.current.innerHTML)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          formatBold()
          break
        case 'i':
          e.preventDefault()
          formatItalic()
          break
        case 'u':
          e.preventDefault()
          formatUnderline()
          break
        case 'k':
          e.preventDefault()
          formatLink()
          break
      }
    }
  }

  // Convert HTML to plain text for validation
  const getPlainText = (html: string) => {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                <FiFileText className="w-6 h-6 text-yellow-800" />
              </div>
              <h1 className="text-xl font-medium text-gray-700">My Notes</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Create Note Form - Google Keep Style with WYSIWYG Editor */}
        <div className="max-w-2xl mx-auto mb-8">
          {!isExpanded ? (
            <div
              onClick={() => setIsExpanded(true)}
              className="bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-text p-4"
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-500 flex-1">Take a note...</span>
                <FiEdit3 className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-300 rounded-lg shadow-md">
              <form onSubmit={handleSubmit} className="p-4 space-y-3">
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-base font-medium placeholder-gray-500 border-none outline-none resize-none"
                  autoFocus
                />

                {/* WYSIWYG Toolbar */}
                <div className="flex items-center gap-1 py-2 border-b border-gray-200">
                  <button
                    type="button"
                    onClick={formatBold}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Bold (Ctrl+B)"
                  >
                    <FiBold className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={formatItalic}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Italic (Ctrl+I)"
                  >
                    <FiItalic className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={formatUnderline}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Underline (Ctrl+U)"
                  >
                    <FiUnderline className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={formatCode}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Code"
                  >
                    <FiCode className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={formatLink}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Link (Ctrl+K)"
                  >
                    <FiLink className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={formatList}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Bullet List"
                  >
                    <FiList className="w-4 h-4 text-gray-600" />
                  </button>
                  <div className="ml-auto text-xs text-gray-400">WYSIWYG Editor</div>
                </div>

                {/* WYSIWYG Editor */}
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={handleEditorInput}
                  onKeyDown={handleKeyDown}
                  className="w-full min-h-[100px] text-sm text-gray-700 border-none outline-none resize-none leading-relaxed p-2 rounded focus:bg-gray-50 transition-colors"
                  style={{
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap'
                  }}
                  data-placeholder="Start writing your note... Select text and use toolbar to format"
                  suppressContentEditableWarning={true}
                />

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    {/* Placeholder for additional tools */}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsExpanded(false)
                        setTitle('')
                        setDescription('')
                        if (editorRef.current) {
                          editorRef.current.innerHTML = ''
                        }
                      }}
                      className="px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      disabled={!title.trim() || !getPlainText(description).trim()}
                      className="px-4 py-1 text-sm bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 disabled:text-gray-400 text-yellow-900 rounded font-medium transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Notes Grid - Masonry Style */}
        {notes.length === 0 ? (
          <div className="text-center py-16">
            <FiFileText className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">Notes you add appear here</h3>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {notes.map((note, index) => (
              <div
                key={note._id}
                className={`group break-inside-avoid ${getRandomColor(index)} border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-800 text-base leading-tight pr-2">
                    {note.title}
                  </h3>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => deleteNote(note._id)}
                      className="p-1 hover:bg-black/10 rounded-full transition-colors"
                      title="Delete note"
                    >
                      <FiTrash2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div
                  className="text-gray-700 text-sm leading-relaxed mb-3 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: note.description }}
                />

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDate(new Date(note.createdAt))}</span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-black/10 rounded-full">
                      <FiMoreVertical className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
