import React, { useState } from 'react';
import { Plus, Filter, Search, Calendar, Flag, User, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TaskModal from './TaskModal';
import AddTaskModal from './AddTaskModal';
import NoProjectsModal from './NoProjectsModal';

interface MyTasksViewProps {
  tasks: any[];
  projects: any[];
  onAddTask: (task: any) => void;
  onUpdateTask: (task: any) => void;
  onDeleteTask: (taskId: number) => void;
}

const MyTasksView: React.FC<MyTasksViewProps> = ({ 
  tasks, 
  projects, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask 
}) => {
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showNoProjectsModal, setShowNoProjectsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All Time');

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Due date filter
    let matchesDueDate = true;
    if (dueDateFilter !== 'All') {
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      
      switch (dueDateFilter) {
        case 'Overdue':
          matchesDueDate = taskDate < today && task.status !== 'Completed';
          break;
        case 'Today':
          matchesDueDate = taskDate.toDateString() === today.toDateString();
          break;
        case 'This Week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          matchesDueDate = taskDate >= weekStart && taskDate <= weekEnd;
          break;
        case 'Next Week':
          const nextWeekStart = new Date(today);
          nextWeekStart.setDate(today.getDate() + (7 - today.getDay()));
          const nextWeekEnd = new Date(nextWeekStart);
          nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
          matchesDueDate = taskDate >= nextWeekStart && taskDate <= nextWeekEnd;
          break;
      }
    }
    
    // Time filter - only apply to completed tasks
    let matchesTimeFilter = true;
    if (timeFilter !== 'All Time' && task.status === 'Completed') {
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      
      switch (timeFilter) {
        case 'This Week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          matchesTimeFilter = taskDate >= weekStart && taskDate <= weekEnd;
          break;
        case 'This Month':
          matchesTimeFilter = taskDate.getMonth() === today.getMonth() && 
                             taskDate.getFullYear() === today.getFullYear();
          break;
      }
    }
    
    return matchesStatus && matchesPriority && matchesSearch && matchesDueDate && matchesTimeFilter;
  });

  // Sort tasks by status priority (Pending first, Completed last)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const statusPriority = {
      'Pending': 1,
      'In Progress': 2,
      'On Hold': 3,
      'Completed': 4
    };
    return statusPriority[a.status] - statusPriority[b.status];
  });

  // Calculate days remaining for a task
  const getDaysRemaining = (dueDate: string) => {
    if (!dueDate) {
      return { text: 'No due date', color: 'text-gray-600', bgColor: 'bg-gray-50' };
    }
    
    const today = new Date();
    const due = new Date(dueDate);
    
    // Check if date is valid
    if (isNaN(due.getTime())) {
      return { text: 'Invalid date', color: 'text-gray-600', bgColor: 'bg-gray-50' };
    }
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, color: 'text-red-600', bgColor: 'bg-red-50' };
    } else if (diffDays === 0) {
      return { text: 'Due today', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    } else if (diffDays <= 3) {
      return { text: `${diffDays} days left`, color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    } else {
      return { text: `${diffDays} days left`, color: 'text-green-600', bgColor: 'bg-green-50' };
    }
  };

  // Get project name by ID
  const getProjectName = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleAddTask = () => {
    // Check if there are any active projects
    const activeProjects = projects.filter(project => !project.archived);
    if (activeProjects.length === 0) {
      setShowNoProjectsModal(true);
      return;
    }
    setShowAddTaskModal(true);
  };

  const handleCreateProjectFromModal = () => {
    setShowNoProjectsModal(false);
    // Navigate to projects view - this would need to be passed down as a prop
    // For now, we'll just close the modal
  };
  const handleSaveTask = (updatedTask) => {
    onUpdateTask(updatedTask);
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const handleCreateTask = (newTask) => {
    onAddTask(newTask);
    setShowAddTaskModal(false);
  };

  const handleDeleteTask = (taskId) => {
    onDeleteTask(taskId);
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const handleStatusChange = (taskId: number, newStatus: string) => {
    const statusOptions = [
      { value: 'Pending', color: 'bg-purple-100 text-purple-800' },
      { value: 'In Progress', color: 'bg-green-100 text-green-800' },
      { value: 'Completed', color: 'bg-blue-100 text-blue-800' },
      { value: 'On Hold', color: 'bg-yellow-100 text-yellow-800' }
    ];
    
    const statusOption = statusOptions.find(option => option.value === newStatus);
    const updatedTask = tasks.find(task => task.id === taskId);
    
    if (updatedTask) {
      onUpdateTask({
        ...updatedTask,
        status: newStatus,
        statusColor: statusOption?.color || 'bg-gray-100 text-gray-800'
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'text-red-600 bg-red-50';
      case 'High':
        return 'text-red-600 bg-red-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'Low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <>
      <main className="flex-1 p-6 overflow-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
              <p className="text-gray-600">Manage your personal tasks and deadlines</p>
            </div>
            <button 
              onClick={handleAddTask}
              className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Task
            </button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All Time">All Time</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Priority</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            
            <select
              value={dueDateFilter}
              onChange={(e) => setDueDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Due Dates</option>
              <option value="Overdue">Overdue</option>
              <option value="Today">Due Today</option>
              <option value="This Week">This Week</option>
              <option value="Next Week">Next Week</option>
            </select>
          </div>

          {/* Task Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{tasks.filter(t => t.status === 'Completed').length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Flag className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{tasks.filter(t => t.status === 'In Progress').length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Overdue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tasks.filter(t => {
                      const dueDate = new Date(t.dueDate);
                      const today = new Date();
                      return dueDate < today && t.status !== 'Completed';
                    }).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Tasks ({filteredTasks.length})
              </h3>
              <div className="flex items-center space-x-2">
                <button className="flex items-center px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4 mr-1" />
                  Filter
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignee
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 px-6 text-center">
                      <div className="text-gray-500">
                        <p className="text-lg font-medium">No tasks found</p>
                        <p className="text-sm">
                          {searchQuery || filterStatus !== 'All' || filterPriority !== 'All'
                            ? 'Try adjusting your filters or search query.'
                            : 'Create your first task to get started.'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedTasks.map((task) => (
                    <tr 
                      key={task.id} 
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="mr-3">
                            <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-600">📋</span>
                            </div>
                          </div>
                          <div>
                            <div 
                              className="font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                              onClick={() => handleTaskClick(task)}
                            >
                              {task.name}
                            </div>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <span className="mr-3">💬 {task.comments}</span>
                              <span>📎 {task.files}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">{getProjectName(task.projectId)}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${task.avatarColor}`}>
                            {task.avatar}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{task.assignee}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="text-sm text-gray-900">{new Date(task.dueDate).toLocaleDateString()}</div>
                          <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getDaysRemaining(task.dueDate).bgColor} ${getDaysRemaining(task.dueDate).color}`}>
                            {getDaysRemaining(task.dueDate).text}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-none outline-none cursor-pointer ${task.statusColor}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="On Hold">On Hold</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleTaskClick(task)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Task Detail Modal */}
      {showTaskModal && selectedTask && (
        <TaskModal
          task={selectedTask}
          projects={projects}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
        />
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <AddTaskModal
          projects={projects}
          onSave={handleCreateTask}
          onClose={() => setShowAddTaskModal(false)}
        />
      )}

      {/* No Projects Modal */}
      {showNoProjectsModal && (
        <NoProjectsModal
          onClose={() => setShowNoProjectsModal(false)}
          onCreateProject={handleCreateProjectFromModal}
        />
      )}
    </>
  );
};

export default MyTasksView;