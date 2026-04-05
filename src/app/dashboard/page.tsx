'use client'

import { BarChart3, CheckCircle2, AlertCircle, TrendingUp, Users, Calendar, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, Alice</p>
          </div>
          <Link href="/dashboard/projects/new" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
            New Project
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Projects', value: '12', icon: BarChart3, trend: '+2 this month' },
            { label: 'Active Tasks', value: '34', icon: CheckCircle2, trend: '-5 completed' },
            { label: 'Team Members', value: '8', icon: Users, trend: 'All active' },
            { label: 'On Time Rate', value: '94%', icon: TrendingUp, trend: '+3% improvement' },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <stat.icon className="w-10 h-10 text-blue-600 opacity-20" />
              </div>
              <p className="text-xs text-gray-500">{stat.trend}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* High Priority Tasks */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">High Priority Tasks</h2>
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </div>
              <div className="space-y-4">
                {[
                  { title: 'Design system components', project: 'Design System v2.0', dueDate: 'Due today', priority: 'high' },
                  { title: 'Implement user authentication', project: 'Mobile App Redesign', dueDate: 'Due tomorrow', priority: 'high' },
                  { title: 'Review client feedback', project: 'Brand Update', dueDate: 'Due in 2 days', priority: 'medium' },
                ].map((task, i) => (
                  <div key={i} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{task.project}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {task.priority === 'high' ? '🔴 High' : '🟡 Medium'}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{task.dueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { action: 'Completed task', detail: 'API Integration', time: '2 hours ago' },
                  { action: 'Created project', detail: 'Q1 Planning', time: '1 day ago' },
                  { action: 'Added team member', detail: 'Sarah Connor', time: '3 days ago' },
                  { action: 'Updated settings', detail: 'Notification preferences', time: '5 days ago' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                    <ArrowUpRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.detail}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Projects</h2>
            <Link href="/dashboard/projects" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Design System v2.0', progress: 65, tasks: '12/18 done', color: 'from-blue-500 to-blue-600' },
              { name: 'Mobile App Redesign', progress: 42, tasks: '8/19 done', color: 'from-purple-500 to-purple-600' },
              { name: 'Brand Update', progress: 88, tasks: '15/17 done', color: 'from-green-500 to-green-600' },
            ].map((project, i) => (
              <Link key={i} href={`/dashboard/projects/${i + 1}`}>
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer">
                  <h3 className="font-bold text-gray-900 mb-4">{project.name}</h3>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">Progress</span>
                      <span className="text-xs font-bold text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${project.color}`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{project.tasks}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
