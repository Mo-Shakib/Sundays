import React, { useState, useEffect } from 'react';
import { X, Mail, Check, Clock, Users, Calendar } from 'lucide-react';
import { CollaborationService, ProjectInvitation, TaskAssignment } from '../../services/collaborationService';
import { useAuth } from '../../context/AuthContext';

interface InvitationsInboxProps {
  isOpen: boolean;
  onClose: () => void;
  onInvitationHandled?: () => void;
}

const InvitationsInbox: React.FC<InvitationsInboxProps> = ({
  isOpen,
  onClose,
  onInvitationHandled
}) => {
  const [invitations, setInvitations] = useState<ProjectInvitation[]>([]);
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'invitations' | 'assignments'>('invitations');
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user?.email) {
      loadInvitations();
    }
  }, [isOpen, user]);

  const loadInvitations = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      const [projectInvitations, taskAssignments] = await Promise.all([
        CollaborationService.getReceivedInvitations(),
        CollaborationService.getTaskAssignments(user.email)
      ]);
      
      setInvitations(projectInvitations.filter(inv => inv.status === 'pending'));
      setAssignments(taskAssignments.filter(assignment => assignment.status === 'pending'));
    } catch (error) {
      console.error('Error loading invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvitationResponse = async (invitationId: number, response: 'accepted' | 'rejected') => {
    const itemKey = `invitation-${invitationId}`;
    setProcessingItems(prev => new Set([...prev, itemKey]));

    try {
      await CollaborationService.respondToProjectInvitation(invitationId, response);
      
      // Remove from local state
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      onInvitationHandled?.();
    } catch (error) {
      console.error('Error responding to invitation:', error);
    } finally {
      setProcessingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }
  };

  const handleAssignmentResponse = async (assignmentId: number, response: 'accepted' | 'rejected') => {
    const itemKey = `assignment-${assignmentId}`;
    setProcessingItems(prev => new Set([...prev, itemKey]));

    try {
      await CollaborationService.respondToTaskAssignment(assignmentId, response);
      
      // Remove from local state
      setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
      onInvitationHandled?.();
    } catch (error) {
      console.error('Error responding to assignment:', error);
    } finally {
      setProcessingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }
  };

  if (!isOpen) return null;

  const totalPending = invitations.length + assignments.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Collaboration Inbox</h2>
              <p className="text-sm text-gray-500">
                {totalPending > 0 ? `${totalPending} pending item${totalPending > 1 ? 's' : ''}` : 'No pending items'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('invitations')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'invitations'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Project Invitations</span>
              {invitations.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px]">
                  {invitations.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'assignments'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Task Assignments</span>
              {assignments.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px]">
                  {assignments.length}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading...</span>
            </div>
          ) : (
            <>
              {/* Project Invitations Tab */}
              {activeTab === 'invitations' && (
                <div className="space-y-4">
                  {invitations.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No project invitations</h3>
                      <p className="text-gray-500">You'll see project invitations from team members here.</p>
                    </div>
                  ) : (
                    invitations.map((invitation) => (
                      <div key={invitation.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium text-gray-900 truncate">
                                {invitation.project?.name || 'Unknown Project'}
                              </h3>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>{invitation.inviter?.name || 'Someone'}</strong> invited you to collaborate
                            </p>
                            
                            {invitation.project?.description && (
                              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                {invitation.project.description}
                              </p>
                            )}
                            
                            {invitation.message && (
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
                                <p className="text-sm text-blue-800 italic">"{invitation.message}"</p>
                              </div>
                            )}
                            
                            <p className="text-xs text-gray-400">
                              Invited {new Date(invitation.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleInvitationResponse(invitation.id, 'rejected')}
                              disabled={processingItems.has(`invitation-${invitation.id}`)}
                              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleInvitationResponse(invitation.id, 'accepted')}
                              disabled={processingItems.has(`invitation-${invitation.id}`)}
                              className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-1"
                            >
                              {processingItems.has(`invitation-${invitation.id}`) ? (
                                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                              <span>Accept</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Task Assignments Tab */}
              {activeTab === 'assignments' && (
                <div className="space-y-4">
                  {assignments.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No task assignments</h3>
                      <p className="text-gray-500">You'll see task assignments from project managers here.</p>
                    </div>
                  ) : (
                    assignments.map((assignment) => (
                      <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium text-gray-900 truncate">
                                {assignment.task?.name || 'Unknown Task'}
                              </h3>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Clock className="w-3 h-3 mr-1" />
                                Assignment
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>{assignment.assigned_by?.name || 'Project Manager'}</strong> assigned you this task
                            </p>
                            
                            <p className="text-sm text-gray-500 mb-2">
                              Project: <strong>{assignment.project?.name || 'Unknown'}</strong>
                            </p>
                            
                            {assignment.task?.description && (
                              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                {assignment.task.description}
                              </p>
                            )}
                            
                            {assignment.assignment_notes && (
                              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-3">
                                <p className="text-sm text-yellow-800 italic">"{assignment.assignment_notes}"</p>
                              </div>
                            )}
                            
                            <p className="text-xs text-gray-400">
                              Assigned {new Date(assignment.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleAssignmentResponse(assignment.id, 'rejected')}
                              disabled={processingItems.has(`assignment-${assignment.id}`)}
                              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleAssignmentResponse(assignment.id, 'accepted')}
                              disabled={processingItems.has(`assignment-${assignment.id}`)}
                              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-1"
                            >
                              {processingItems.has(`assignment-${assignment.id}`) ? (
                                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                              <span>Accept</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {totalPending > 0 && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Respond to invitations and assignments to start collaborating
              </p>
              <button
                onClick={loadInvitations}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitationsInbox;