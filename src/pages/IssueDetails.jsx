import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Paperclip, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Edit, 
  Plus,
  Trash2,
  Download,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Import reusable components
import Button from '../common/Button';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Select from '../common/Select';
import Card from '../common/Card';
import Badge from '../common/Badge';
import LoadingSpinner from '../common/LoadingSpinner';
import UserAvatar from '../common/UserAvatar';
import EmptyState from '../common/EmptyState';

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [commentText, setCommentText] = useState("");
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [subtaskDescription, setSubtaskDescription] = useState("");
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Sample issue data - in real app, you'd fetch this from your API
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setIssue({
        _id: id,
        key: 'WEB-101',
        title: 'Login page not responsive on mobile devices',
        summary: 'Login form breaks on mobile screens smaller than 375px',
        description: 'When accessing the login page on mobile devices with screen widths below 375px, the form elements overflow their container and become unusable. This affects both iOS and Android devices.',
        issue_type: 'bug',
        status: 'open',
        priority: 'high',
        story_points: 3,
        reporter_id: {
          _id: '2',
          name: 'Michael Chen',
          avatar: null
        },
        assignee_id: {
          _id: '1',
          name: 'Sarah Johnson',
          avatar: null
        },
        created_at: '2023-06-15T10:30:00Z',
        updated_at: '2023-06-18T14:45:00Z',
        due_date: '2023-06-25T23:59:59Z',
        estimated_time: 8,
        actual_time: 4,
        environment: 'Production - Chrome Mobile iOS',
        labels: ['mobile', 'ui', 'responsive'],
        sprint_id: {
          _id: 'sprint1',
          name: 'Sprint 12 - Q2 2023'
        },
        is_blocked: false,
        blocked_reason: '',
        attachments: [
          {
            _id: 'att1',
            file_name: 'screenshot-mobile.png',
            file_type: 'image/png',
            file_size: 2457600,
            uploaded_by: {
              _id: '2',
              name: 'Michael Chen'
            },
            uploaded_at: '2023-06-15T11:20:00Z'
          }
        ],
        comments: [
          {
            _id: 'comment1',
            user_id: {
              _id: '1',
              name: 'Sarah Johnson',
              avatar: null
            },
            content: "I've started looking into this. The issue seems to be with the CSS media queries not accounting for very small screens.",
            created_at: '2023-06-16T09:15:00Z'
          },
          {
            _id: 'comment2',
            user_id: {
              _id: '3',
              name: 'Emma Davis',
              avatar: null
            },
            content: "This might be related to the recent changes we made to the form layout component. I'll check the commit history.",
            created_at: '2023-06-16T14:30:00Z'
          }
        ],
        subtasks: [
          {
            _id: 'sub1',
            title: 'Test on various mobile devices',
            description: 'Verify the fix works across different screen sizes',
            status: 'open',
            reporter_id: {
              _id: '1',
              name: 'Sarah Johnson'
            },
            assignee_id: {
              _id: '5',
              name: 'You'
            },
            due_date: '2023-06-23T23:59:59Z',
            created_at: '2023-06-16T09:20:00Z'
          }
        ],
        history: [
          {
            field: 'status',
            old_value: 'open',
            new_value: 'in_progress',
            changed_by: {
              _id: '1',
              name: 'Sarah Johnson'
            },
            changed_at: '2023-06-16T09:15:00Z'
          }
        ]
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    
    const newComment = {
      _id: `comment${Date.now()}`,
      user_id: {
        _id: 'current-user',
        name: 'You',
        avatar: null
      },
      content: commentText,
      created_at: new Date().toISOString()
    };

    setIssue(prev => ({
      ...prev,
      comments: [...prev.comments, newComment]
    }));
    setCommentText("");
  };

  const handleAddSubtask = () => {
    if (!subtaskTitle.trim()) return;
    
    const newSubtask = {
      _id: `sub${Date.now()}`,
      title: subtaskTitle,
      description: subtaskDescription,
      status: 'open',
      reporter_id: {
        _id: 'current-user',
        name: 'You'
      },
      assignee_id: null,
      due_date: null,
      created_at: new Date().toISOString()
    };

    setIssue(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, newSubtask]
    }));
    
    setSubtaskTitle("");
    setSubtaskDescription("");
    setShowSubtaskForm(false);
  };

  const handleUpdateField = (field, value) => {
    setIssue(prev => ({
      ...prev,
      [field]: value
    }));
    setEditingField(null);
    setEditValue("");
  };

  const priorityOptions = [
    { value: 'lowest', label: 'Lowest' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'highest', label: 'Highest' },
    { value: 'critical', label: 'Critical' }
  ];

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
    { value: 'reopened', label: 'Reopened' }
  ];

  const typeOptions = [
    { value: 'bug', label: 'Bug' },
    { value: 'task', label: 'Task' },
    { value: 'story', label: 'Story' },
    { value: 'epic', label: 'Epic' }
  ];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!issue) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Issue not found"
        description="The requested issue could not be found."
        action={
          <Button
            onClick={() => navigate('/issues')}
            icon={ArrowLeft}
            variant="primary"
          >
            Back to Issues
          </Button>
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="small"
                onClick={() => navigate('/issues')}
                icon={ArrowLeft}
                className="mr-4"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {issue.key}: {issue.title}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Created by {issue.reporter_id.name} • {new Date(issue.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="secondary" icon={Edit}>
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card title="Description">
              <p className="text-gray-700 whitespace-pre-wrap">
                {issue.description || "No description provided."}
              </p>
            </Card>

            {/* Comments */}
            <Card title="Comments">
              <div className="space-y-4">
                {issue.comments.map((comment) => (
                  <div key={comment._id} className="flex space-x-3">
                    <UserAvatar user={comment.user_id} size="medium" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">{comment.user_id.name}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
                
                {/* Add Comment */}
                <div className="mt-6">
                  <TextArea
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                  />
                  <div className="mt-2 flex justify-end">
                    <Button
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                      variant="primary"
                      icon={MessageSquare}
                    >
                      Add Comment
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Subtasks */}
            <Card 
              title="Subtasks" 
              actions={
                <Button
                  onClick={() => setShowSubtaskForm(!showSubtaskForm)}
                  variant="primary"
                  size="small"
                  icon={Plus}
                >
                  Add Subtask
                </Button>
              }
            >
              {/* Subtask Form */}
              {showSubtaskForm && (
                <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div className="space-y-3">
                    <Input
                      label="Title"
                      value={subtaskTitle}
                      onChange={(e) => setSubtaskTitle(e.target.value)}
                      placeholder="Enter subtask title"
                    />
                    <TextArea
                      label="Description (Optional)"
                      value={subtaskDescription}
                      onChange={(e) => setSubtaskDescription(e.target.value)}
                      rows={2}
                      placeholder="Enter subtask description"
                    />
                    <div className="flex space-x-3 justify-end">
                      <Button
                        onClick={() => setShowSubtaskForm(false)}
                        variant="secondary"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddSubtask}
                        disabled={!subtaskTitle.trim()}
                        variant="primary"
                      >
                        Add Subtask
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {issue.subtasks.length > 0 ? (
                <div className="space-y-3">
                  {issue.subtasks.map((subtask) => (
                    <div key={subtask._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={subtask.status === 'resolved'}
                          className="h-4 w-4 text-[#01a370] focus:ring-[#01a370] border-gray-300 rounded"
                        />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{subtask.title}</h4>
                          {subtask.description && (
                            <p className="text-sm text-gray-500">{subtask.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {subtask.due_date && new Date(subtask.due_date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No subtasks yet.</p>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details Card */}
            <Card title="Details">
              <div className="space-y-4">
                {/* Status */}
                <Select
                  label="Status"
                  value={issue.status}
                  onChange={(e) => handleUpdateField('status', e.target.value)}
                  options={statusOptions}
                />

                {/* Assignee */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                  <div className="flex items-center space-x-2 p-2 border border-gray-300 rounded-md">
                    <UserAvatar user={issue.assignee_id} size="small" />
                    <span className="text-sm text-gray-900">{issue.assignee_id?.name || 'Unassigned'}</span>
                  </div>
                </div>

                {/* Priority */}
                <Select
                  label="Priority"
                  value={issue.priority}
                  onChange={(e) => handleUpdateField('priority', e.target.value)}
                  options={priorityOptions}
                />

                {/* Type */}
                <Select
                  label="Type"
                  value={issue.issue_type}
                  onChange={(e) => handleUpdateField('issue_type', e.target.value)}
                  options={typeOptions}
                />

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <div className="flex items-center space-x-2 text-sm text-gray-900">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{issue.due_date ? new Date(issue.due_date).toLocaleDateString() : 'No due date'}</span>
                  </div>
                </div>

                {/* Story Points */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Story Points</label>
                  <div className="text-sm text-gray-900">{issue.story_points || 'Not estimated'}</div>
                </div>

                {/* Labels */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Labels</label>
                  <div className="flex flex-wrap gap-2">
                    {issue.labels.map((label) => (
                      <Badge key={label} variant="primary">
                        {label}
                      </Badge>
                    ))}
                    {issue.labels.length === 0 && (
                      <span className="text-sm text-gray-500">No labels</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Attachments */}
            <Card title="Attachments">
              {issue.attachments.length > 0 ? (
                <div className="space-y-3">
                  {issue.attachments.map((attachment) => (
                    <div key={attachment._id} className="flex items-center justify-between p-2 border border-gray-200 rounded-md">
                      <div className="flex items-center space-x-3">
                        <Paperclip className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {attachment.file_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(attachment.file_size)} • {new Date(attachment.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-2">No attachments</p>
              )}
            </Card>

            {/* Time Tracking */}
            <Card title="Time Tracking">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Estimated:</span>
                  <span className="text-sm font-medium text-gray-900">{issue.estimated_time || 0}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Logged:</span>
                  <span className="text-sm font-medium text-gray-900">{issue.actual_time || 0}h</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-900">Remaining:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.max(0, (issue.estimated_time || 0) - (issue.actual_time || 0))}h
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IssueDetails;