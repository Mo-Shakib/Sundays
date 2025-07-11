import React, { useState, useRef, useEffect } from 'react';
import { Search, FolderOpen, CheckSquare, Clock, User, X } from 'lucide-react';

interface SearchResult {
  id: number;
  type: 'project' | 'task';
  title: string;
  subtitle?: string;
  description?: string;
  projectName?: string;
  status?: string;
  priority?: string;
  assignee?: string;
  dueDate?: string;
}

interface SearchComponentProps {
  projects: any[];
  tasks: any[];
  onProjectSelect: (projectId: number) => void;
  onTaskSelect?: (task: any) => void;
  onViewChange: (view: string) => void;
  placeholder?: string;
  isMobile?: boolean;
  onClose?: () => void;
  searchRef?: React.RefObject<HTMLInputElement>;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  projects,
  tasks,
  onProjectSelect,
  onTaskSelect,
  onViewChange,
  placeholder = "Search projects and tasks...",
  isMobile = false,
  onClose,
  searchRef: externalRef
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Use external ref if provided, otherwise use internal ref
  const finalInputRef = externalRef || inputRef;

  // Filter and search logic
  const searchResults: SearchResult[] = React.useMemo(() => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    // Search projects
    projects.forEach(project => {
      if (
        project.name.toLowerCase().includes(searchTerm) ||
        project.description?.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: project.id,
          type: 'project',
          title: project.name,
          subtitle: project.archived ? 'Archived Project' : 'Active Project',
          description: project.description,
        });
      }
    });

    // Search tasks
    tasks.forEach(task => {
      const projectName = projects.find(p => p.id === task.projectId)?.name || 'Unknown Project';
      
      if (
        task.name.toLowerCase().includes(searchTerm) ||
        task.description?.toLowerCase().includes(searchTerm) ||
        task.assignee?.toLowerCase().includes(searchTerm) ||
        projectName.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: task.id,
          type: 'task',
          title: task.name,
          subtitle: projectName,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assignee: task.assignee,
          dueDate: task.dueDate,
          projectName
        });
      }
    });

    return results.slice(0, 8); // Limit to 8 results
  }, [query, projects, tasks]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && searchResults[selectedIndex]) {
            handleResultClick(searchResults[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          handleClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, searchResults]);

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.trim().length > 0);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    if (query.trim()) {
      setIsOpen(true);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'project') {
      onProjectSelect(result.id);
      onViewChange('Dashboard');
    } else if (result.type === 'task') {
      // Find the task and call onTaskSelect if provided
      const task = tasks.find(t => t.id === result.id);
      if (task && onTaskSelect) {
        onTaskSelect(task);
      } else {
        // Navigate to My Task view as fallback
        onViewChange('My Task');
      }
    }
    handleClose();
  };

  const handleClose = () => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    if (onClose) onClose();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in progress': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-orange-600 bg-orange-50';
      case 'on hold': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={finalInputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={`block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            isMobile ? 'bg-white' : 'hover:bg-gray-50'
          }`}
        />
        {query && (
          <button
            onClick={handleClose}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
        {!isMobile && !query && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">⌘ K</span>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="py-2">
            {searchResults.map((result, index) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-l-4 ${
                  selectedIndex === index 
                    ? 'bg-blue-50 border-l-blue-500' 
                    : result.type === 'project' 
                      ? 'border-l-green-400' 
                      : 'border-l-blue-400'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    result.type === 'project' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {result.type === 'project' ? (
                      <FolderOpen className="w-4 h-4" />
                    ) : (
                      <CheckSquare className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        result.type === 'project' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {result.type === 'project' ? 'Project' : 'Task'}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-1">{result.subtitle}</p>
                    
                    {result.description && (
                      <p className="text-xs text-gray-600 truncate mb-2">
                        {result.description}
                      </p>
                    )}
                    
                    {result.type === 'task' && (
                      <div className="flex items-center space-x-2 text-xs">
                        {result.status && (
                          <span className={`px-2 py-1 rounded-full font-medium ${getStatusColor(result.status)}`}>
                            {result.status}
                          </span>
                        )}
                        {result.priority && (
                          <span className={`px-2 py-1 rounded-full font-medium ${getPriorityColor(result.priority)}`}>
                            {result.priority}
                          </span>
                        )}
                        {result.assignee && (
                          <div className="flex items-center text-gray-500">
                            <User className="w-3 h-3 mr-1" />
                            {result.assignee}
                          </div>
                        )}
                        {result.dueDate && (
                          <div className="flex items-center text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(result.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {query && searchResults.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No results found for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try searching for project names or task titles</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;