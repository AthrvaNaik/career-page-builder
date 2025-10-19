import { useState } from 'react';
import { GripVertical, Trash2, Eye, EyeOff } from 'lucide-react';

export default function SectionEditor({ section, onUpdate, onDelete, onReorder }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(section);

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(section);
    setIsEditing(false);
  };

  return (
    <div className="card mb-4">
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <button
          className="mt-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          onMouseDown={() => onReorder && onReorder(section.id)}
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={editData.content}
                  onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                  rows={5}
                  className="input-field"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} className="btn-primary">
                  Save
                </button>
                <button onClick={handleCancel} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                    {section.type}
                  </span>
                  {section.isVisible ? (
                    <Eye className="w-4 h-4 text-green-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap mb-4">{section.content}</p>
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(true)} className="btn-secondary text-sm">
                  Edit
                </button>
                <button
                  onClick={() => onDelete(section.id)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}