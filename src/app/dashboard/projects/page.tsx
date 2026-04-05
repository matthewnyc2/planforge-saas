'use client'

import { Search, Plus, MoreVertical, Folder, Users, Calendar, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const projects = [
  {
    id: 1,
    name: 'Design System v2.0',
    description: 'Complete redesign of our UI component library with improved accessibility',
    progress: 65,
    tasks: { total: 18, done: 12 },
    team: 4,
    dueDate: 'Mar 15',
    priority: 'high',
    color: 'from-blue-500 to-blue-600',
    members: ['🧑', '👩', '🧑', '👨']
  },
  {
    id: 2,
    name: 'Mobile App Redesign',
    description: 'Modern mobile experience with improved navigation and performance',
    progress: 42,
    tasks: { total: 19, done: 8 },
    team: 3,
    dueDate: 'Apr 1',
    priority: 'high',
    color: 'from-purple-500 to-purple-600',
    members: ['👩', '🧑', '👨']
  },
  {
    id: 3,
    name: 'Brand Update',
    description: 'Refresh brand identity with new color palette and typography',
    progress: 88,
    tasks: { total: 17, done: 15 },
    team: 2,
    dueDate: 'Feb 28',
    priority: 'medium',
    color: 'from-green-500 to-green-600',
    members: ['🧑', '👩']
  },
  {
    id: 4,
    name: 'API Migration',
    description: 'Migrate legacy API endpoints to new GraphQL architecture',
    progress: 25,
    tasks: { total: 24, done: 6 },
    team: 3,
    dueDate: 'May 10',
    priority: 'medium',
    color: 'from-orange-500 to-orange-600',
    members: ['👨', '🧑', '👩']
  },
]

export default function ProjectsPage() {
  const [search, setSearch] = useState('')

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600">Manage all your projects and tasks</p>
            </div>
            <Link href="/dashboard/projects/new" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>
            <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">Progress</span>
                      <span className="text-xs font-bold text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${project.color} transition-all duration-500`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Tasks and Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <p className="text-xs text-gray-600">Tasks</p>
                      <p className="font-bold text-gray-900">{project.tasks.done}/{project.tasks.total}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Team</p>
                      <p className="font-bold text-gray-900">{project.team}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Due</p>
                      <p className="font-bold text-gray-900 text-sm">{project.dueDate}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex gap-1">
                      {project.members.map((member, i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                          {member}
                        </div>
                      ))}
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      project.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {project.priority === 'high' ? '🔴 High' : '🟡 Medium'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
