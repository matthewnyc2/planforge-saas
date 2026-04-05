'use client'

import { Plus, MoreVertical, Clock, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface Task {
  id: number
  title: string
  priority: 'high' | 'medium' | 'low'
  dueDate: string
  member: string
}

interface TasksState {
  todo: Task[]
  inprogress: Task[]
  done: Task[]
}

export default function KanbanBoard() {
  const [tasks] = useState<TasksState>({
    todo: [
      { id: 1, title: 'Design homepage hero', priority: 'high', dueDate: '3 days', member: '👩' },
      { id: 2, title: 'Create brand guidelines', priority: 'medium', dueDate: '1 week', member: '🧑' },
      { id: 3, title: 'Set up analytics', priority: 'low', dueDate: '2 weeks', member: '👨' },
    ],
    inprogress: [
      { id: 4, title: 'Build authentication flow', priority: 'high', dueDate: 'Today', member: '🧑' },
      { id: 5, title: 'Implement search feature', priority: 'medium', dueDate: '2 days', member: '👩' },
    ],
    done: [
      { id: 6, title: 'Setup database schema', priority: 'high', dueDate: 'Completed', member: '👨' },
      { id: 7, title: 'Configure CI/CD pipeline', priority: 'high', dueDate: 'Completed', member: '🧑' },
      { id: 8, title: 'Write API documentation', priority: 'medium', dueDate: 'Completed', member: '👩' },
    ]
  })

  const priorityColors: Record<string, string> = {
    high: 'border-l-red-500 bg-red-50',
    medium: 'border-l-yellow-500 bg-yellow-50',
    low: 'border-l-green-500 bg-green-50'
  }

  const priorityDot: Record<string, string> = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  }

  const Column = ({ title, count, tasks: columnTasks }: { title: string; count: number; tasks: Task[]; columnId?: string }) => (
    <div className="flex flex-col h-full min-h-96 bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-gray-600 bg-gray-200 rounded-full">
            {count}
          </span>
        </div>
        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {columnTasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 bg-white rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${priorityColors[task.priority]}`}
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-medium text-gray-900 flex-1">{task.title}</h4>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${priorityDot[task.priority]}`} />
                <span className="text-xs text-gray-600 capitalize">{task.priority}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-600">{task.dueDate}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                {task.member}
              </div>
              {task.priority === 'high' && (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" />
        Add Task
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Design System v2.0</h1>
              <p className="text-gray-600">Complete redesign of our UI component library</p>
            </div>
            <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Column title="To Do" count={tasks.todo.length} tasks={tasks.todo} />
          <Column title="In Progress" count={tasks.inprogress.length} tasks={tasks.inprogress} />
          <Column title="Done" count={tasks.done.length} tasks={tasks.done} />
        </div>
      </div>
    </div>
  )
}
