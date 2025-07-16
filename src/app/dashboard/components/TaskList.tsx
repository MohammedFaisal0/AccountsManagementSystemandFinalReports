'use client';

import React, { useState, useEffect } from 'react';

// Define the Task type based on Prisma schema
interface Task {
  task_id: number;
  title: string;
  due_date: string | null;
  priority: string;
  completed: boolean;
  user_id: number | null;
  created_at: string;
  updated_at: string;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // --- Task Action Handlers ---
  const handleAddTask = () => {
    alert('Add Task functionality not implemented yet.');
  };

  const handleToggleComplete = async (taskId: number, currentStatus: boolean) => {
    alert('Task completion functionality not implemented yet.');
  };

  const handleDeleteTask = async (taskId: number) => {
    alert('Delete task functionality not implemented yet.');
  };

  // --- Helper Functions ---
  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'عالي': return 'bg-red-500';
      case 'medium':
      case 'متوسط': return 'bg-orange-500';
      case 'low':
      case 'منخفض': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'عالي': return 'عالي';
      case 'medium':
      case 'متوسط': return 'متوسط';
      case 'low':
      case 'منخفض': return 'منخفض';
      default: return 'غير محدد';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(dateString));
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">المهام</h3>
          <p className="text-sm text-gray-500">إدارة المهام والأنشطة</p>
        </div>
        <button 
          onClick={handleAddTask}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          إضافة مهمة
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">جاري تحميل المهام...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}
      
      {/* Tasks List */}
      <div className="flex-1 overflow-auto">
        {!isLoading && !error && tasks.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">لا توجد مهام لعرضها</p>
            <p className="text-gray-400 text-xs mt-1">انقر على "إضافة مهمة" لإنشاء مهمة جديدة</p>
          </div>
        )}

        {tasks.length > 0 && (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.task_id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => handleToggleComplete(task.task_id, task.completed)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                          task.completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {task.completed && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <h4 className={`font-medium text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.title}
                      </h4>
                    </div>
                    {task.due_date && (
                      <p className="text-xs text-gray-500 mb-2">
                        تاريخ الاستحقاق: {formatDate(task.due_date)}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)} text-white`}>
                        {getPriorityText(task.priority)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.task_id)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

