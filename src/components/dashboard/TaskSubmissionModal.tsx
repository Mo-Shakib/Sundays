import React, { useState } from 'react';
import { X, Send, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { CollaborationService } from '../../services/collaborationService';

interface TaskSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  onTaskSubmitted?: () => void;
}

const TaskSubmissionModal: React.FC<TaskSubmissionModalProps> = ({
  isOpen,
  onClose,
  task,
  onTaskSubmitted
}) => {
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError('');

    try {
      // For now, we'll need to get the assignment ID from the task's collaboration info
      const collaborationInfo = await CollaborationService.getTaskCollaborationInfo(task.id);
      
      if (!collaborationInfo.assignment) {
        throw new Error('No assignment found for this task');
      }

      await CollaborationService.submitTask(
        task.id,
        collaborationInfo.assignment.id,
        submissionNotes.trim() || undefined,
        submissionUrl.trim() || undefined
      );

      setSubmissionNotes('');
      setSubmissionUrl('');
      onTaskSubmitted?.();
      onClose();
    } catch (err) {
      console.error('Error submitting task:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit task');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Submit Task</h2>
              <p className="text-sm text-gray-500 truncate max-w-48">{task.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Task Details */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Task Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Priority:</span>
                <span className="font-medium">{task.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Due Date:</span>
                <span className="font-medium">{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
              {task.description && (
                <div>
                  <span className="text-gray-500">Description:</span>
                  <p className="text-gray-700 mt-1">{task.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Completion Status */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-green-800">Ready to Submit</h3>
                <p className="text-sm text-green-700 mt-1">
                  Mark this task as complete and send it for review. The project manager will be notified and can approve or request changes.
                </p>
              </div>
            </div>
          </div>

          {/* Submission URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work URL (Optional)
            </label>
            <input
              type="url"
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              placeholder="https://github.com/user/repo or https://drive.google.com/..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Link to your completed work (GitHub repo, Google Drive, etc.)
            </p>
          </div>

          {/* Submission Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Completion Notes
            </label>
            <textarea
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              rows={4}
              placeholder="Describe what you completed, any challenges faced, or additional context for the reviewer..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Help your reviewer understand what was accomplished
            </p>
          </div>

          {/* Next Steps Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• The project manager will be notified of your submission</li>
              <li>• They can approve, reject, or request revisions</li>
              <li>• You'll be notified of their decision</li>
              <li>• If approved, the task will be marked as completed</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{isSubmitting ? 'Submitting...' : 'Submit for Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskSubmissionModal;