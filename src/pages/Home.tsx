import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, GraduationCap, Briefcase } from 'lucide-react';

export function Home() {
  const features = [
    {
      icon: <Heart className="w-12 h-12 text-red-500" />,
      title: "Community Support",
      description: "Connect with volunteers ready to help with various needs"
    },
    {
      icon: <Users className="w-12 h-12 text-blue-500" />,
      title: "Language Exchange",
      description: "Practice languages with native speakers"
    },
    {
      icon: <GraduationCap className="w-12 h-12 text-green-500" />,
      title: "Student Opportunities",
      description: "Earn volunteer hours while making a difference"
    },
    {
      icon: <Briefcase className="w-12 h-12 text-purple-500" />,
      title: "Professional Help",
      description: "Access employment and recovery support services"
    }
  ];

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Szar
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Building stronger communities through volunteer service and mutual support
        </p>
        <div className="mt-8 space-x-4">
          <Link
            to="/services"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Find Services
          </Link>
          <Link
            to="/auth"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Become a Volunteer
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-xl p-8 shadow-sm">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
            <p className="text-gray-600">Create an account as a volunteer or service seeker</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect</h3>
            <p className="text-gray-600">Browse services or volunteer opportunities</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Make an Impact</h3>
            <p className="text-gray-600">Help others and strengthen your community</p>
          </div>
        </div>
      </section>
    </div>
  );
}