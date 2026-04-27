import React, { useState, useRef } from 'react'
import './App.css'

function App() {
  const [notes, setNotes] = useState([])
  const [editingId, setEditingId] = useState(null)
  const inputRef = useRef(null)
  const isEditing = editingId !== null

  const handleAdd = () => {
    const text = inputRef.current.value.trim()
    if (!text) { inputRef.current.focus(); return }
    setNotes(prev => [
      { id: Date.now(), text, createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ...prev,
    ])
    inputRef.current.value = ''
    inputRef.current.focus()
  }

  const handleEdit = (note) => {
    setEditingId(note.id)
    inputRef.current.value = note.text
    inputRef.current.focus()
    inputRef.current.select()
  }

  const handleUpdate = () => {
    const text = inputRef.current.value.trim()
    if (!text) { inputRef.current.focus(); return }
    setNotes(prev => prev.map(n => n.id === editingId ? { ...n, text } : n))
    setEditingId(null)
    inputRef.current.value = ''
    inputRef.current.focus()
  }

  const handleCancel = () => {
    setEditingId(null)
    inputRef.current.value = ''
    inputRef.current.focus()
  }

  const handleDelete = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    if (editingId === id) { setEditingId(null); inputRef.current.value = '' }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') isEditing ? handleUpdate() : handleAdd()
    if (e.key === 'Escape' && isEditing) handleCancel()
  }

  return (
    <div className="page">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="container">

        <header className="app-header">
          <div className="logo-mark">✦</div>
          <h1 className="app-title">Notes App</h1>
          <p className="app-subtitle">Capture your thoughts, simply.</p>
        </header>

        <div className={`input-card${isEditing ? ' input-card--editing' : ''}`}>
          {isEditing && (
            <div className="edit-banner">
              <span className="edit-dot" />
              Editing note — press Esc to cancel
            </div>
          )}
          <div className="input-row">
            <input
              ref={inputRef}
              type="text"
              className="note-input"
              placeholder={isEditing ? 'Edit your note…' : 'Write a new note…'}
              onKeyDown={handleKeyDown}
            />
            <button
              className={`btn-primary${isEditing ? ' btn-update' : ' btn-add-mode'}`}
              onClick={isEditing ? handleUpdate : handleAdd}
            >
              {isEditing ? 'Update' : 'Add'}
            </button>
          </div>
          {isEditing
            ? <button className="btn-cancel-edit" onClick={handleCancel}>✕ Cancel editing</button>
            : <p className="input-hint">Press <kbd>Enter</kbd> to quickly add</p>
          }
        </div>

        {notes.length > 0 && (
          <div className="notes-meta">
            <span className="notes-count">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</span>
            <div className="divider-line" />
          </div>
        )}

        {notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗒️</div>
            <p className="empty-title">No notes yet</p>
            <p className="empty-sub">Add your first note above to get started.</p>
          </div>
        ) : (
          <ul className="notes-list">
            {notes.map((note, i) => (
              <li
                key={note.id}
                className={`note-card${editingId === note.id ? ' note-card--active' : ''}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="note-body">
                  <p className="note-text">{note.text}</p>
                  <span className="note-time">{note.createdAt}</span>
                </div>
                <div className="note-actions">
                  <button className="btn-action btn-edit-action" onClick={() => handleEdit(note)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <button className="btn-action btn-delete-action" onClick={() => handleDelete(note.id)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
