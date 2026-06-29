/**
 * Senior Frontend Developer Implementation
 * Enterprise LMS Category Creation Component & Custom React Query Hook
 * 
 * Stack: Next.js (App Router), React, React Query (@tanstack/react-query), Tailwind CSS
 */

'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FolderPlus, Loader2, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

// ============================================================================
// Types Definition
// ============================================================================
export interface CreateCategoryInput {
  name: string;
  icon: string;
  description: string;
  color: string;
  isActive: boolean;
}

export interface Category extends CreateCategoryInput {
  id: string;
  courseCount: number;
}

// ============================================================================
// Custom React Query Hook (useCreateCategory)
// ============================================================================
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCategory: CreateCategoryInput): Promise<Category> => {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create curriculum category node.');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate the cache to trigger a background refresh of categories lists
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      // Optionally trigger system telemetry or toast notifications
      console.log(`[LMS System] Category "${data.name}" provisioned successfully.`, data);
    },
  });
}

// ============================================================================
// Form Component: CreateCategoryForm
// ============================================================================
interface CreateCategoryFormProps {
  onSuccessCallback?: (newCategory: Category) => void;
  onCancelCallback?: () => void;
}

export const CreateCategoryForm: React.FC<CreateCategoryFormProps> = ({
  onSuccessCallback,
  onCancelCallback,
}) => {
  // 1. Setup local state for controlled input fields
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#01AC9F');
  const [isActive, setIsActive] = useState(true);

  // 2. Instantiate our custom React Query hook
  const { mutate: createCategory, isPending, error, isSuccess, reset: resetMutation } = useCreateCategory();

  // 3. Handle submit action
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createCategory(
      {
        name: name.trim(),
        icon: icon.trim(),
        description: description.trim(),
        color,
        isActive,
      },
      {
        onSuccess: (data) => {
          // Reset form fields
          setName('');
          setIcon('');
          setDescription('');
          setColor('#01AC9F');
          setIsActive(true);

          // Reset mutation state after some time
          setTimeout(() => resetMutation(), 5000);

          // Invoke callback if supplied
          if (onSuccessCallback) {
            onSuccessCallback(data);
          }
        },
      }
    );
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col">
      {/* Form Header */}
      <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#01AC9F]/10 flex items-center justify-center text-[#01AC9F]">
            <FolderPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800 tracking-tight">Create Curriculum Category</h3>
            <p className="text-xs text-gray-400 mt-0.5">Build a taxonomy node to structure your courses.</p>
          </div>
        </div>
      </div>

      {/* Main Form Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Status Alerts (Success / Error states) */}
        {isSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2.5 border border-emerald-100">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Category node created successfully! Taxonomy cache invalidated.</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl flex items-center gap-2.5 border border-rose-100">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Error: {error instanceof Error ? error.message : 'Failed to save.'}</span>
          </div>
        )}

        {/* Name (Required) */}
        <div>
          <label htmlFor="category-name" className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Category Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="category-name"
            type="text"
            required
            disabled={isPending}
            placeholder="e.g. Artificial Intelligence"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#510047] focus:ring-1 focus:ring-[#ffd7f0] transition-colors disabled:opacity-60"
          />
        </div>

        {/* Icon & IsActive Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Icon (Emoji or CDN URL) */}
          <div>
            <label htmlFor="category-icon" className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Icon Representation
            </label>
            <input
              id="category-icon"
              type="text"
              disabled={isPending}
              placeholder="e.g. 🤖 or https://cdn.com/logo.png"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#510047] focus:ring-1 focus:ring-[#ffd7f0] transition-colors disabled:opacity-60"
            />
          </div>

          {/* Is Active Toggle Switch */}
          <div>
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Status Lifecycle
            </span>
            <div className="flex items-center h-[46px]">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setIsActive((prev) => !prev)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                  isActive ? 'bg-[#01AC9F]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="ml-3 text-xs font-semibold text-gray-600 select-none">
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="category-description" className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Short Description
          </label>
          <textarea
            id="category-description"
            disabled={isPending}
            placeholder="Summarize what kind of courses belong to this branch..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#510047] transition-colors resize-none focus:ring-1 focus:ring-[#ffd7f0] disabled:opacity-60"
          />
        </div>

        {/* Color picker and hex text input */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Theme Accent Color
          </label>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-gray-200 shrink-0">
              <input
                type="color"
                disabled={isPending}
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-125 bg-transparent disabled:opacity-50"
              />
            </div>
            <input
              type="text"
              disabled={isPending}
              placeholder="#01AC9F"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-32 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:bg-white focus:border-[#510047] transition-colors disabled:opacity-60"
            />
            
            {/* Color Swatch suggestions */}
            <div className="flex flex-wrap gap-1.5 ml-2">
              {['#01AC9F', '#510047', '#2563EB', '#EA580C', '#16A34A', '#9333EA'].map((hex) => (
                <button
                  key={hex}
                  type="button"
                  disabled={isPending}
                  onClick={() => setColor(hex)}
                  className="w-5 h-5 rounded-full border border-white shadow-sm hover:scale-110 active:scale-95 transition-all"
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          {onCancelCallback && (
            <button
              type="button"
              disabled={isPending}
              onClick={onCancelCallback}
              className="px-5 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isPending || !name.trim()}
            className="px-6 py-2.5 bg-[#01AC9F] hover:bg-[#008f84] text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Create Category
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
