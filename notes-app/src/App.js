import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // useRef for the main add input
  const inputRef = useRef(null);
  // useRef for the edit input (keyed per note)
  const editInputRef = useRef(null);

  // Event handler: Add a new note
  const handleAdd = () => {
    const text = inputRef.current.value.trim();
    if (!text) {
      inputRef.current.focus();
      return;
    }
    const newNote = {
      id: Date.now(),
      text,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setNotes((prev) => [newNote, ...prev]);
    inputRef.current.value = '';
    inputRef.current.focus();
  };

  // Event handler: Enter key on main input
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  // Event handler: Start editing — fill input with current text
  const handleEdit = (note) => {
    setEditingId(note.id);
    // After state update, focus the edit input via useRef (set in setTimeout)
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.value = note.text;
        editInputRef.current.focus();
        editInputRef.current.select();
      }
    }, 0);
  };

  // Event handler: Save edited note
  const handleSave = (id) => {
    const newText = editInputRef.current?.value.trim();
    if (!newText) return;
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, text: newText } : n))
    );
    setEditingId(null);
  };

  // Event handler: Cancel edit
  const handleCancel = () => {
    setEditingId(null);
  };

  // Event handler: Enter/Escape keys in edit input
  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') handleSave(id);
    if (e.key === 'Escape') handleCancel();
  };

  // Event handler: Delete a note
  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (editingId === id) setEditingId(null);
  };

  return (
    <div className="app-wrapper">
      <div className="app-container">

        {/* Header */}
        <header className="app-header">
          <h1 className="app-title">Notes</h1>
          <span className="note-count">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</span>
        </header>

        {/* Add Note Input */}
        <div className="add-section">
          <div className="input-row">
            <input
              ref={inputRef}
              type="text"
              className="main-input"
              placeholder="Write a new note..."
              onKeyDown={handleInputKeyDown}
            />
            <button className="btn-add" onClick={handleAdd}>
              <span className="btn-add-icon">+</span>
              <span>Add</span>
            </button>
          </div>
          <p className="input-hint">Press Enter or click Add</p>
        </div>

        {/* Notes List */}
        <div className="notes-section">
          {notes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p className="empty-title">No notes yet</p>
              <p className="empty-sub">Start by typing something above</p>
            </div>
          ) : (
            <ul className="notes-list">
              {notes.map((note) => (
                <li key={note.id} className={`note-card ${editingId === note.id ? 'note-card--editing' : ''}`}>
                  {editingId === note.id ? (
                    /* Edit Mode */
                    <div className="note-edit-mode">
                      <input
                        ref={editInputRef}
                        type="text"
                        className="edit-input"
                        defaultValue={note.text}
                        onKeyDown={(e) => handleEditKeyDown(e, note.id)}
                      />
                      <div className="edit-actions">
                        <button className="btn-save" onClick={() => handleSave(note.id)}>
                          Save
                        </button>
                        <button className="btn-cancel" onClick={handleCancel}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <div className="note-view-mode">
                      <div className="note-content">
                        <p className="note-text">{note.text}</p>
                        <span className="note-time">{note.createdAt}</span>
                      </div>
                      <div className="note-actions">
                        <button className="btn-edit" onClick={() => handleEdit(note)}>
                          Edit
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(note.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
