import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BookOpen, Users, Heart, GraduationCap, Briefcase, Search, Plus, CheckCircle } from 'lucide-react';

type Service = {
  id: string;
  title: string;
  description: string;
  category: string;
  requirements: string;
  volunteer_hours_reward: number;
};

const categoryIcons = {
  'language': BookOpen,
  'community': Users,
  'health': Heart,
  'education': GraduationCap,
  'professional': Briefcase,
};

export function Services() {
  const navigate = useNavigate();
  const location = useLocation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    location.state?.message || null
  );

  useEffect(() => {
    fetchServices();
    checkUserStatus();

    // Clear success message after 5 seconds
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  async function checkUserStatus() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user status:', error);
    }
  }

  async function fetchServices() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(services.map(service => service.category)));

  return (
    <div className="space-y-8">
      {successMessage && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Services</h1>
            <p className="text-gray-600">
              Browse available services or volunteer opportunities in your community
            </p>
          </div>
          <Link
            to="/services/create"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            <span>Create Service</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => {
              const IconComponent = categoryIcons[service.category as keyof typeof categoryIcons] || Users;
              return (
                <div key={service.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition">
                  <div className="flex items-center gap-3 mb-4">
                    <IconComponent className="w-6 h-6 text-blue-500" />
                    <span className="text-sm font-medium text-blue-500">
                      {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                  {service.volunteer_hours_reward > 0 && (
                    <div className="text-sm text-green-600 mb-4">
                      Volunteer Hours: {service.volunteer_hours_reward}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (!user) {
                        navigate('/auth');
                      } else {
                        navigate(`/services/${service.id}/volunteer`);
                      }
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Apply to Volunteer
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}