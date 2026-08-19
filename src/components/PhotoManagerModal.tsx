import React, { useState, useRef } from 'react';
import { MemoryPhoto } from '../types';
import { X, Upload, Trash2, Edit2, Check, RotateCcw, Plus, Image as ImageIcon } from 'lucide-react';
import { INITIAL_PHOTOS } from '../utils/presetPhotos';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  photos: MemoryPhoto[];
  setPhotos: React.Dispatch<React.SetStateAction<MemoryPhoto[]>>;
  onSelectPhoto: (index: number) => void;
}

export const PhotoManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  photos,
  setPhotos,
  onSelectPhoto
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        if (url) {
          const newPhoto: MemoryPhoto = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
            url: url,
            caption: file.name.replace(/\.[^/.]+$/, "") || 'Holiday Memory'
          };
          setPhotos(prev => [...prev, newPhoto]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemovePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const startEditCaption = (photo: MemoryPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(photo.id);
    setEditCaption(photo.caption);
  };

  const saveCaption = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotos(prev =>
      prev.map(p => (p.id === id ? { ...p, caption: editCaption.trim() || 'Holiday Memory' } : p))
    );
    setEditingId(null);
  };

  const resetToDefault = () => {
    setPhotos(INITIAL_PHOTOS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-neutral-950 border border-white/20 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Memory Photo Gallery</h2>
              <p className="text-xs text-white/50">These photos rotate in the 3D Explode Carousel & Zoom view</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Upload Drop Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-amber-500/5 hover:bg-amber-500/10 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-sm font-semibold text-amber-200">
              Click or Drag & Drop to Upload Custom Photos
            </div>
            <div className="text-xs text-white/50">
              Supports JPG, PNG, WEBP. Add pictures of family, partners, friends, or festive celebrations!
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => {
                  onSelectPhoto(index);
                  onClose();
                }}
                className="group relative bg-neutral-900 border border-white/10 hover:border-amber-400/80 rounded-2xl overflow-hidden shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              >
                {/* Photo Thumbnail */}
                <div className="aspect-square bg-neutral-800 relative">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-[10px] font-bold text-amber-300 px-2 py-0.5 rounded-md border border-white/10">
                    #{index + 1}
                  </div>
                </div>

                {/* Caption / Edit */}
                <div className="p-2.5 bg-neutral-900/90 text-xs">
                  {editingId === photo.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={editCaption}
                        onChange={e => setEditCaption(e.target.value)}
                        className="w-full bg-black/60 border border-amber-500/50 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={e => saveCaption(photo.id, e)}
                        className="p-1 text-emerald-400 hover:bg-white/10 rounded"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate font-medium text-white/90 text-[11px]">
                        {photo.caption}
                      </span>
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={e => startEditCaption(photo, e)}
                          className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white"
                          title="Rename Caption"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={e => handleRemovePhoto(photo.id, e)}
                          className="p-1 hover:bg-red-500/20 rounded text-rose-400 hover:text-rose-300"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {photos.length === 0 && (
            <div className="text-center py-8 text-white/50 text-sm">
              No photos loaded. Click above to add some or restore holiday defaults!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-neutral-900/50">
          <button
            onClick={resetToDefault}
            className="flex items-center gap-1.5 text-xs text-white/70 hover:text-amber-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default Cards</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-transform active:scale-95 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
