import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, FileText, ExternalLink, User, Calendar } from 'lucide-react';
import { CollaborationService, TaskSubmission } from '../../services/collaborationService';

interface TaskReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  onReviewCompleted?: () => void;
}

const TaskReviewModal: React.FC<TaskReviewModalProps> = ({
  isOpen,
  onClose,
  task,
  onReviewCompleted
}) => {
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<TaskSubmission | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && task) {
      loadSubmissions();
    }
  }, [isOpen, task]);

  const loadSubmissions = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const taskSubmissions = await CollaborationService.getTaskSubmissions(task.id);
      setSubmissions(taskSubmissions);
      
      // Select the most recent pending submission by default
      const pendingSubmission = taskSubmissions.find(s => s.status === 'submitted');
      if (pendingSubmission) {
        setSelectedSubmission(pendingSubmission);
      } else if (taskSubmissions.length > 0) {
        setSelectedSubmission(taskSubmissions[0]);
      }
    } catch (err) {
      console.error('Error loading submissions:', err);
      setError('Failed to load submissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async (status: 'approved' | 'rejected' | 'revision_requested') => {
    if (!selectedSubmission) return;

    setIsReviewing(true);
    setError('');

    try {
      await CollaborationService.reviewTaskSubmission(
        selectedSubmission.id,
        status,
        reviewNotes.trim() || undefined
      );

      // Refresh submissions
      await loadSubmissions();
      setReviewNotes('');
      onReviewCompleted?.();
      
      if (status === 'approved') {
        onClose();
      }
    } catch (err) {
      console.error('Error reviewing submission:', err);
      setError(err instanceof Error ? err.message : 'Failed to review submission');
    } finally {
      setIsReviewing(false);
    }
  };

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'revision_requested':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <FileText className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'revision_requested':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Review Task Submission</h2>
              <p className="text-sm text-gray-500 truncate max-w-96">{task.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Submissions List */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-3">Submissions History</h3>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2 text-sm text-gray-600">Loading...</span>
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No submissions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((submission) => (
                    <div
                      key={submission.id}
                      onClick={() => setSelectedSubmission(submission)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedSubmission?.id === submission.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                          {getStatusIcon(submission.status)}
                          <span className="ml-1 capitalize">{submission.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <User className="w-3 h-3 mr-1" />
                        <span>{submission.submitter_name || 'Unknown'}</span>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{new Date(submission.submitted_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submission Details */}
          <div className="flex-1 flex flex-col">
            {selectedSubmission ? (
              <>
                {/* Submission Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Submission Info */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Submission Details</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedSubmission.status)}`}>
                        {getStatusIcon(selectedSubmission.status)}
                        <span className="ml-2 capitalize">{selectedSubmission.status.replace('_', ' ')}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Submitted by</label>
                        <p className="text-sm text-gray-900">{selectedSubmission.submitter_name || 'Unknown'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Submitted on</label>
                        <p className="text-sm text-gray-900">
                          {new Date(selectedSubmission.submitted_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Work URL */}
                  {selectedSubmission.submission_url && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Work Link</label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <a
                          href={selectedSubmission.submission_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          <span className="truncate">{selectedSubmission.submission_url}</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Submission Notes */}
                  {selectedSubmission.submission_notes && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Completion Notes</label>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 whitespace-pre-wrap">
                          {selectedSubmission.submission_notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Previous Review */}
                  {selectedSubmission.review_notes && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Previous Review</label>
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <User className="w-4 h-4 mr-1" />
                          <span>Reviewed by {selectedSubmission.reviewer_name || 'Unknown'}</span>
                          {selectedSubmission.reviewed_at && (
                            <>
                              <span className="mx-2">•</span>
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>{new Date(selectedSubmission.reviewed_at).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                          {selectedSubmission.review_notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Review Form - Only show for pending submissions */}
                  {selectedSubmission.status === 'submitted' && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Review Notes</label>
                      <textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        rows={4}
                        placeholder="Add your feedback about this submission..."
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                      />
                    </div>
                  )}
                </div>

                {/* Review Actions - Only show for pending submissions */}
                {selectedSubmission.status === 'submitted' && (
                  <div className="border-t border-gray-200 p-6">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => handleReview('revision_requested')}
                        disabled={isReviewing}
                        className="px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-lg hover:bg-yellow-200 transition-colors disabled:opacity-50 flex items-center space-x-2"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span>Request Changes</span>
                      </button>
                      
                      <button
                        onClick={() => handleReview('rejected')}
                        disabled={isReviewing}
                        className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center space-x-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                      
                      <button
                        onClick={() => handleReview('approved')}
                        disabled={isReviewing}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                      >
                        {isReviewing ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        <span>{isReviewing ? 'Approving...' : 'Approve'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No submission selected</h3>
                  <p className="text-gray-500">Select a submission from the list to review</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskReviewModal;