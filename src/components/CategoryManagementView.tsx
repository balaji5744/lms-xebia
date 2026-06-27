import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Category } from '../types';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Edit, 
  Trash2, 
  Code, 
  Users, 
  ShieldCheck, 
  Palette, 
  Briefcase, 
  CheckCircle2, 
  EyeOff, 
  Sparkles,
  Check,
  AlertCircle,
  FolderPlus
} from 'lucide-react';

export const CategoryManagementView: React.FC = () => {
  const { 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    showSmartTagsToast,
    setShowSmartTagsToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  
  // Sorting state
  const [sortField, setSortField] = useState<'name' | 'code' | 'courseCount'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive',
    icon: '',
    color: '#01AC9F'
  });

  // AI smart tags state
  const [isAiRunning, setIsAiRunning] = useState(false);

  // Map icons dynamically
  const getCategoryIcon = (code: string) => {
    const cleanCode = code.toUpperCase();
    if (cleanCode.startsWith('DEV')) return Code;
    if (cleanCode.startsWith('LDR')) return Users;
    if (cleanCode.startsWith('SEC')) return ShieldCheck;
    if (cleanCode.startsWith('CRT')) return Palette;
    if (cleanCode.startsWith('BUS')) return Briefcase;
    return FolderPlus;
  };

  // Filter and Sort Categories
  const filteredCategories = useMemo(() => {
    return categories
      .filter(cat => {
        const matchesSearch = 
          cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === 'All' ? true : cat.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        
        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = (valB as string).toLowerCase();
        }
        
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [categories, searchQuery, statusFilter, sortField, sortDirection]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: categories.length,
      active: categories.filter(c => c.status === 'Active').length,
      inactive: categories.filter(c => c.status === 'Inactive').length
    };
  }, [categories]);

  // Handle Sort Toggle
  const handleSort = (field: 'name' | 'code' | 'courseCount') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Open Modal for Create
  const handleCreateOpen = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      status: 'Active',
      icon: '',
      color: '#01AC9F'
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleEditOpen = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      code: cat.code,
      description: cat.description,
      status: cat.status,
      icon: cat.icon || '',
      color: cat.color || '#01AC9F'
    });
    setIsModalOpen(true);
  };

  // Save Modal Form
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      alert('Please fill in Name and Code fields.');
      return;
    }

    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        name: formData.name,
        code: formData.code,
        description: formData.description,
        status: formData.status,
        icon: formData.icon,
        color: formData.color
      });
    } else {
      addCategory({
        name: formData.name,
        code: formData.code,
        description: formData.description,
        status: formData.status,
        icon: formData.icon,
        color: formData.color
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the category "${name}"? Courses associated with this category will remain, but their category label will need re-indexing.`)) {
      deleteCategory(id);
    }
  };

  // Simulate AI Smart Classification
  const runAiCategorization = () => {
    setIsAiRunning(true);
    setTimeout(() => {
      setIsAiRunning(false);
      setShowSmartTagsToast(true);
      setTimeout(() => setShowSmartTagsToast(false), 6000);
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Page Heading Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-gray-400 mb-2">
            <span>Courses</span>
            <span className="text-gray-300">/</span>
            <span className="text-[#510047]">Category Management</span>
          </nav>
          <h2 className="text-3xl font-bold font-headline text-[#510047]">Course Categories</h2>
          <p className="text-gray-500 text-sm mt-1">Organize and structure your curriculum with enterprise-grade taxonomy.</p>
        </div>
        
        <button 
          onClick={handleCreateOpen}
          className="flex items-center gap-2 px-6 py-3 bg-[#01AC9F] hover:bg-[#008f84] text-white font-semibold text-sm rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4" />
          Add New Category
        </button>
      </div>

      {/* Stats Cards (Asymmetric Bento Lite) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-[#510047]/5 flex items-center justify-center text-[#510047]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Total Categories</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 border-b-4 border-[#01AC9F]">
          <div className="w-12 h-12 rounded-xl bg-[#01AC9F]/5 flex items-center justify-center text-[#01AC9F]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Active Categories</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.active}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-orange-500/5 flex items-center justify-center text-orange-600">
            <EyeOff className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Hidden/Archived</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.inactive}</h3>
          </div>
        </div>
      </div>

      {/* Table & Filtering Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filter Controls Header */}
        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-bold text-gray-800 font-headline">Category List</h3>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Inline search */}
            <div className="relative flex-grow sm:flex-grow-0 sm:w-60">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#510047] focus:ring-1 focus:ring-[#ffd7f0]"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 focus:ring-1 focus:ring-[#ffd7f0] cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <button 
              onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
              className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Categories Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th 
                  onClick={() => handleSort('name')}
                  className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors"
                >
                  <span className="flex items-center gap-1">
                    Name <ArrowUpDown className="w-3.5 h-3.5" />
                  </span>
                </th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th 
                  onClick={() => handleSort('courseCount')}
                  className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors"
                >
                  <span className="flex items-center gap-1">
                    Courses <ArrowUpDown className="w-3.5 h-3.5" />
                  </span>
                </th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => {
                  // Calculate dynamic visual percentage relative to highest count
                  const maxCount = Math.max(...categories.map(c => c.courseCount));
                  const percentage = maxCount > 0 ? (cat.courseCount / maxCount) * 100 : 0;

                  const renderIcon = () => {
                    if (cat.icon) {
                      const isUrl = cat.icon.startsWith('http://') || cat.icon.startsWith('https://') || cat.icon.startsWith('/');
                      if (isUrl) {
                        return (
                          <img 
                            src={cat.icon} 
                            alt={cat.name} 
                            className="w-6 h-6 object-cover rounded-md"
                            referrerPolicy="no-referrer"
                          />
                        );
                      } else {
                        return <span className="text-xl leading-none">{cat.icon}</span>;
                      }
                    }
                    const IconComponent = getCategoryIcon(cat.code);
                    return <IconComponent className="w-5 h-5" />;
                  };

                  const iconBgStyle = cat.color 
                    ? { backgroundColor: `${cat.color}15`, borderColor: `${cat.color}30`, color: cat.color } 
                    : {};

                  return (
                    <tr key={cat.id} className="hover:bg-gray-50/50 transition-all duration-150 group">
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-10 h-10 rounded-lg bg-[#510047]/10 flex items-center justify-center text-[#510047] border border-[#510047]/15"
                            style={iconBgStyle}
                          >
                            {renderIcon()}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-800">{cat.name}</p>
                            <p className="text-[10px] text-gray-400 font-mono tracking-wider font-semibold mt-0.5">Code: {cat.code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4.5">
                        <p className="text-xs text-gray-500 max-w-sm line-clamp-2 leading-relaxed">{cat.description || "No description provided."}</p>
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-xs text-gray-800 font-mono w-6">{cat.courseCount}</span>
                          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#01AC9F] rounded-full transition-all duration-500" 
                              style={{ width: `${percentage}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-2">
                          {cat.status === 'Active' ? (
                            <>
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#01AC9F] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#01AC9F]"></span>
                              </span>
                              <span className="text-xs font-medium text-[#006a62]">Active</span>
                            </>
                          ) : (
                            <>
                              <span className="h-2 w-2 rounded-full bg-gray-300" />
                              <span className="text-xs font-medium text-gray-400">Inactive</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4.5 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button 
                            onClick={() => handleEditOpen(cat)}
                            className="p-1.5 text-gray-400 hover:text-[#510047] hover:bg-[#ffd7f0]/40 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(cat.id, cat.name)}
                            className="p-1.5 text-gray-400 hover:text-[#ba1a1a] hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-8 h-8 text-gray-300" />
                      <p className="text-sm">No categories match your current search constraints.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer representation */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <p>Showing <span className="font-semibold text-gray-800">{filteredCategories.length}</span> of <span className="font-semibold text-gray-800">{categories.length}</span> categories</p>
          <div className="flex gap-1.5">
            <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 cursor-not-allowed text-[11px]" disabled>Previous</button>
            <button className="px-3 py-1 bg-[#510047] text-white rounded-lg font-semibold text-[11px]">1</button>
            <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 cursor-not-allowed text-[11px]" disabled>Next</button>
          </div>
        </div>
      </div>

      {/* Contextual AI Automation Card */}
      <div className="p-8 rounded-3xl bg-[#6c1d5f] text-white relative overflow-hidden group shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h4 className="text-xl font-bold font-headline text-[#76f7e8] flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#76f7e8]" />
              Automate Your Taxonomy?
            </h4>
            <p className="text-sm text-white/80 leading-relaxed">
              Use our AI-powered auto-categorization tool to parse course descriptions and structure hundreds of curricular items instantly based on advanced keyword density analysis.
            </p>
          </div>
          
          <button 
            onClick={runAiCategorization}
            disabled={isAiRunning}
            className={`px-6 py-3.5 rounded-2xl shadow-md font-bold text-sm tracking-wide transition-all active:scale-95 flex items-center gap-2 shrink-0 ${
              isAiRunning 
                ? 'bg-white/30 text-white cursor-not-allowed' 
                : 'bg-white text-[#510047] hover:shadow-xl hover:bg-[#76f7e8] hover:text-[#510047]'
            }`}
          >
            {isAiRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                Analyzing Courses...
              </>
            ) : (
              <>
                Enable AI Smart Tags
              </>
            )}
          </button>
        </div>

        {/* Background gradient decorative shapes */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#76f7e8]/10 rounded-full blur-3xl group-hover:bg-[#76f7e8]/20 transition-all duration-700" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-700" />
      </div>

      {/* Toast Smart Tags Confirmation banner */}
      {showSmartTagsToast && (
        <div className="fixed bottom-6 right-6 max-w-md bg-[#303030] text-white p-4 rounded-xl shadow-2xl border border-white/10 z-50 flex gap-3 animate-slide-up">
          <div className="w-8 h-8 rounded-full bg-[#01AC9F]/20 flex items-center justify-center shrink-0 text-[#76f7e8]">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#76f7e8]">AI Smart Tags Sync Completed</p>
            <p className="text-[11px] text-white/80 mt-1 leading-relaxed">
              Parsed 24 catalog courses. Standardized tag taxonomy for "DEV-01", "SEC-03", and matched 12 latent descriptions successfully.
            </p>
          </div>
        </div>
      )}

      {/* CREATE / EDIT CATEGORY MODAL DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg mx-4 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-scale-up">
            {/* Modal Header */}
            <div className="p-6 bg-gray-50 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#510047] font-headline">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Configure your curriculum taxonomy node fields below.</p>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#510047] focus:ring-1 focus:ring-[#ffd7f0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Code Prefix *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ART-05"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#510047] focus:ring-1 focus:ring-[#ffd7f0] font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Is Active</label>
                  <div className="flex items-center h-10">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: formData.status === 'Active' ? 'Inactive' : 'Active' })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        formData.status === 'Active' ? 'bg-[#01AC9F]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          formData.status === 'Active' ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className="ml-3 text-xs font-semibold text-gray-600">
                      {formData.status === 'Active' ? 'Active & Visible' : 'Hidden / Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Icon Representation</label>
                  <span className="text-[10px] text-gray-400">Emoji or CDN image URL</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. 🤖 or https://example.com/logo.png"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#fbfbfb] border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#510047] focus:ring-1 focus:ring-[#ffd7f0]"
                />
                
                {/* Preset Emojis Row for ultra usability */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] font-bold text-gray-400 mr-1">Presets:</span>
                  {['💻', '🧠', '🛡️', '🎨', '📈', '🏛️', '🧪', '🌍', '📊'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg border text-sm transition-all hover:bg-[#ffd7f0]/20 hover:scale-105 active:scale-95 ${
                        formData.icon === emoji ? 'border-[#510047] bg-[#ffd7f0]/10 font-bold' : 'border-gray-100 bg-gray-50 text-gray-600'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Short Description</label>
                <textarea
                  placeholder="Summarize what kind of courses belong to this branch..."
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#510047] resize-none focus:ring-1 focus:ring-[#ffd7f0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Theme Accent Color</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-125 bg-transparent"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="#01AC9F"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-32 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:bg-white focus:border-[#510047]"
                  />
                  
                  {/* Hex Color preset tags */}
                  <div className="flex flex-wrap gap-1.5 ml-2">
                    {['#01AC9F', '#510047', '#2563EB', '#EA580C', '#16A34A', '#9333EA'].map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: hex })}
                        className="w-5 h-5 rounded-full border border-white shadow-sm hover:scale-110 active:scale-95 transition-transform"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#01AC9F] hover:bg-[#008f84] text-white font-bold text-xs rounded-lg shadow-md transition-all"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
