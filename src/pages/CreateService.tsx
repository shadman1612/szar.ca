import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { FileText, Clock, Tag, ListChecks } from 'lucide-react';

const categories = [
  'language',
  'community',
  'health',
  'education',
  'professional'
];

export function CreateService() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'community',
    requirements: '',
    volunteer_hours_reward: 1
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in to create a service');

      const { error: insertError } = await supabase
        .from('services')
        .insert({
          ...formData,
          created_by: user.id
        });

      if (insertError) throw insertError;
      navigate('/services');
    } catch (err: any) {
      console.error('Error creating service:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create a New Service</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Service Title</span>
              </div>
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., English Language Tutoring"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Describe the service you're offering..."
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>Category</span>
              </div>
            </label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4" />
                <span>Requirements</span>
              </div>
            </label>
            <textarea
              id="requirements"
              rows={3}
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="List any requirements for volunteers..."
            />
          </div>

          <div>
            <label htmlFor="volunteer_hours_reward" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Volunteer Hours Reward</span>
              </div>
            </label>
            <input
              type="number"
              id="volunteer_hours_reward"
              required
              min="0"
              value={formData.volunteer_hours_reward}
              onChange={(e) => setFormData({ ...formData, volunteer_hours_reward: parseInt(e.target.value) })}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Service'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}