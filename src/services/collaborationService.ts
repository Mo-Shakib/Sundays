import { supabase } from '../lib/supabase';

export interface ProjectInvitation {
  id: number;
  project_id: number;
  inviter_id: string;
  invitee_email: string;
  invitee_name?: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  created_at: string;
  updated_at: string;
  project?: {
    name: string;
    description: string;
  };
  inviter?: {
    name: string;
    email: string;
  };
}

export interface TaskAssignment {
  id: number;
  task_id: number;
  project_id: number;
  assigned_by_id: string;
  assigned_to_email: string;
  assigned_to_name?: string;
  status: 'pending' | 'accepted' | 'rejected';
  assignment_notes?: string;
  created_at: string;
  updated_at: string;
  task?: {
    name: string;
    description: string;
  };
  project?: {
    name: string;
  };
  assigned_by?: {
    name: string;
    email: string;
  };
}

export interface TaskSubmission {
  id: number;
  task_id: number;
  assignment_id: number;
  submitter_id: string;
  submission_notes?: string;
  submission_url?: string;
  status: 'submitted' | 'approved' | 'rejected' | 'revision_requested';
  review_notes?: string;
  reviewed_by_id?: string;
  submitted_at: string;
  reviewed_at?: string;
  submitter_name?: string;
  reviewer_name?: string;
}

export class CollaborationService {
  // Project Invitations
  static async sendProjectInvitation(
    projectId: number,
    inviteeEmail: string,
    inviteeName: string,
    message?: string
  ) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('project_invitations')
      .insert({
        project_id: projectId,
        inviter_id: user.id,
        invitee_email: inviteeEmail,
        invitee_name: inviteeName,
        message: message,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getReceivedInvitations(): Promise<ProjectInvitation[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('project_invitations')
      .select(`
        *,
        project:projects(id, name, description),
        inviter:profiles!project_invitations_inviter_id_fkey(name, email)
      `)
      .eq('invitee_email', user.email)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(invitation => ({
      ...invitation,
      project: invitation.project,
      inviter: invitation.inviter
    }));
  }

  static async getSentInvitations(): Promise<ProjectInvitation[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('project_invitations')
      .select(`
        *,
        project:projects(id, name, description),
        inviter:profiles!project_invitations_inviter_id_fkey(name, email)
      `)
      .eq('inviter_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(invitation => ({
      ...invitation,
      project: invitation.project,
      inviter: invitation.inviter
    }));
  }

  static async respondToProjectInvitation(
    invitationId: number,
    status: 'accepted' | 'rejected'
  ) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Update invitation status
    const { data: invitation, error: updateError } = await supabase
      .from('project_invitations')
      .update({ status })
      .eq('id', invitationId)
      .select(`
        *,
        project:projects!project_invitations_project_id_fkey(id, name, description)
      `)
      .single();

    if (updateError) throw updateError;

    // If accepted, add user as project member
    if (status === 'accepted' && invitation) {
      const { error: memberError } = await supabase
        .from('project_members')
        .upsert({
          project_id: invitation.project_id,
          user_id: user.id,
          role: 'member'
        }, {
          onConflict: 'project_id,user_id'
        });

      if (memberError) {
        console.error('Error adding project member:', memberError);
        throw memberError;
      }
    }

    return invitation;
  }

  // Task Assignments
  static async assignTask(
    taskId: number,
    projectId: number,
    assigneeEmail: string,
    assigneeName: string,
    notes?: string
  ) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('task_assignments')
      .insert({
        task_id: taskId,
        project_id: projectId,
        assigned_by_id: user.id,
        assigned_to_email: assigneeEmail,
        assigned_to_name: assigneeName,
        assignment_notes: notes,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getTaskAssignments(userEmail: string): Promise<TaskAssignment[]> {
    const { data, error } = await supabase
      .from('task_assignments')
      .select(`
        *,
        task:tasks!task_assignments_task_id_fkey(id, name, description),
        project:projects!task_assignments_project_id_fkey(id, name),
        assigned_by:profiles!task_assignments_assigned_by_id_fkey(name, email)
      `)
      .eq('assigned_to_email', userEmail)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(assignment => ({
      ...assignment,
      task: assignment.task,
      project: assignment.project,
      assigned_by: assignment.assigned_by
    }));
  }

  static async respondToTaskAssignment(
    assignmentId: number,
    status: 'accepted' | 'rejected'
  ) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('task_assignments')
      .update({ status })
      .eq('id', assignmentId)
      .select(`
        *,
        task:tasks!task_assignments_task_id_fkey(id, name, description),
        project:projects!task_assignments_project_id_fkey(id, name)
      `)
      .single();

    if (error) throw error;

    // If accepted, ensure user has access to the project
    if (status === 'accepted' && data) {
      const { error: memberError } = await supabase
        .from('project_members')
        .insert({
          project_id: data.project_id,
          user_id: user.id,
          role: 'member'
        });

      // Ignore duplicate key errors
      if (memberError && !memberError.message.includes('duplicate')) {
        console.warn('Could not add user as project member:', memberError);
      }
    }

    return data;
  }

  // Task Submissions
  static async submitTask(
    taskId: number,
    assignmentId: number,
    submissionNotes?: string,
    submissionUrl?: string
  ) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('task_submissions')
      .insert({
        task_id: taskId,
        assignment_id: assignmentId,
        submitter_id: user.id,
        submission_notes: submissionNotes,
        submission_url: submissionUrl,
        status: 'submitted'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async reviewTaskSubmission(
    submissionId: number,
    status: 'approved' | 'rejected' | 'revision_requested',
    reviewNotes?: string
  ) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('task_submissions')
      .update({
        status,
        review_notes: reviewNotes,
        reviewed_by_id: user.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', submissionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getTaskSubmissions(taskId: number): Promise<TaskSubmission[]> {
    const { data, error } = await supabase
      .from('task_submissions')
      .select(`
        *,
        submitter:profiles!task_submissions_submitter_id_fkey(name),
        reviewer:profiles!task_submissions_reviewed_by_id_fkey(name)
      `)
      .eq('task_id', taskId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(submission => ({
      ...submission,
      submitter_name: submission.submitter?.name,
      reviewer_name: submission.reviewer?.name
    }));
  }

  // Get collaboration info for a specific task
  static async getTaskCollaborationInfo(taskId: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get assignment info
    const { data: assignment } = await supabase
      .from('task_assignments')
      .select(`
        *,
        profiles!task_assignments_assigned_by_id_fkey(name, email)
      `)
      .eq('task_id', taskId)
      .single();

    // Get latest submission
    const { data: submissions } = await supabase
      .from('task_submissions')
      .select(`
        *,
        submitter:profiles!task_submissions_submitter_id_fkey(name),
        reviewer:profiles!task_submissions_reviewed_by_id_fkey(name)
      `)
      .eq('task_id', taskId)
      .order('submitted_at', { ascending: false })
      .limit(1);

    const latestSubmission = submissions?.[0];

    return {
      assignment: assignment ? {
        ...assignment,
        assigned_by_name: assignment.profiles?.name,
        assigned_by_email: assignment.profiles?.email
      } : null,
      submission: latestSubmission ? {
        ...latestSubmission,
        submitter_name: latestSubmission.submitter?.name,
        reviewer_name: latestSubmission.reviewer?.name
      } : null
    };
  }

  // Get project members
  static async getProjectMembers(projectId: number) {
    const { data, error } = await supabase
      .from('project_members')
      .select(`
        *,
        user:profiles(name, email)
      `)
      .eq('project_id', projectId);

    if (error) throw error;
    return data || [];
  }

  // Check if user has access to project
  static async hasProjectAccess(projectId: number, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }

  // Get pending invitations count
  static async getPendingInvitationsCount(userEmail: string): Promise<number> {
    const { count, error } = await supabase
      .from('project_invitations')
      .select('*', { count: 'exact', head: true })
      .eq('invitee_email', userEmail)
      .eq('status', 'pending');

    if (error) throw error;
    return count || 0;
  }

  // Get pending task assignments count
  static async getPendingAssignmentsCount(userEmail: string): Promise<number> {
    const { count, error } = await supabase
      .from('task_assignments')
      .select('*', { count: 'exact', head: true })
      .eq('assigned_to_email', userEmail)
      .eq('status', 'pending');

    if (error) throw error;
    return count || 0;
  }

  // Get pending submissions for review (for project owners)
  static async getPendingSubmissionsForReview(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('task_submissions')
      .select(`
        *,
        assignment:task_assignments!inner(
          project:projects!inner(user_id)
        )
      `, { count: 'exact', head: true })
      .eq('status', 'submitted')
      .eq('assignment.project.user_id', userId);

    if (error) throw error;
    return count || 0;
  }

  // Get all projects user has access to (owned + member)
  static async getUserAccessibleProjects(userId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_members!inner(user_id)
      `)
      .eq('project_members.user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get all tasks user has access to (owned + assigned)
  static async getUserAccessibleTasks(userId: string, userEmail: string) {
    // Get owned tasks
    const { data: ownedTasks, error: ownedError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);

    if (ownedError) throw ownedError;

    // Get assigned tasks
    const { data: assignedTasks, error: assignedError } = await supabase
      .from('task_assignments')
      .select(`
        tasks!inner(*)
      `)
      .eq('assigned_to_email', userEmail)
      .eq('status', 'accepted');

    if (assignedError) throw assignedError;

    // Combine and deduplicate
    const allTasks = [
      ...(ownedTasks || []),
      ...(assignedTasks || []).map(a => a.tasks)
    ];

    // Remove duplicates by task ID
    const uniqueTasks = allTasks.filter((task, index, self) => 
      index === self.findIndex(t => t.id === task.id)
    );

    return uniqueTasks;
  }
}