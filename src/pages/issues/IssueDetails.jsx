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
import { toast } from "react-toastify";


// Import reusable components
import Button from '../../common/Button';
import Input from '../../common/Input';
import TextArea from '../../common/TextArea';
import Select from '../../common/Select';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import LoadingSpinner from '../../common/LoadingSpinner';
import UserAvatar from '../../common/UserAvatar';
import EmptyState from '../../common/EmptyState';
import { IssueApis } from "../../api";

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

  const fetchIssue = async () => {
    try {
      setLoading(true);
      const response = await IssueApis.getIssueById(id);
      if (response.success) {
        setIssue(response.data);
      }
    } catch (error) {
      console.error("Fetch issue error:", error);
      toast.error(error.message?.error_message || "Failed to load issue details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const handleDeleteIssue = async () => {
    if (window.confirm("Are you sure you want to delete this issue? This action cannot be undone.")) {
      try {
        const response = await IssueApis.deleteIssue(id);
        if (response.success) {
          navigate("/issues");
        }
      } catch (err) {
        console.error("Delete failed:", err);
        toast.error(err.message?.error_message || "Failed to delete issue");
      }
    }
  };


  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await IssueApis.addComment(id, commentText.trim());
      if (response.success) {
        setIssue(response.data);
        setCommentText("");
      }
    } catch (err) {
      console.error("Add comment failed:", err);
      toast.error(err.message?.error_message || "Failed to add comment");
    }
  };

  const handleAddSubtask = async () => {
    if (!subtaskTitle.trim()) return;

    try {
      const subtaskData = {
        title: subtaskTitle.trim(),
        description: subtaskDescription.trim(),
      };
      const response = await IssueApis.addSubtask(id, subtaskData);
      if (response.success) {
        setIssue(response.data);
        setSubtaskTitle("");
        setSubtaskDescription("");
        setShowSubtaskForm(false);
      }
    } catch (err) {
      console.error("Add subtask failed:", err);
      toast.error(err.message?.error_message || "Failed to add subtask");
    }
  };

  const handleUpdateField = async (field, value) => {
    try {
      const response = await IssueApis.updateIssue(id, { [field]: value });
      if (response.success) {
        setIssue(response.data);
      }
    } catch (err) {
      console.error(`Update ${field} failed:`, err);
      toast.error(err.message?.error_message || `Failed to update ${field}`);
    }
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
              <Button
                variant="secondary"
                icon={Edit}
                onClick={() => navigate(`/issues/new?edit=${issue._id}`)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                icon={Trash2}
                onClick={handleDeleteIssue}
              >
                Delete
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
                          <a
                            href={`http://localhost:4500/${attachment.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-gray-900 hover:text-[#01a370] truncate max-w-xs transition-colors"
                          >
                            {attachment.file_name}
                          </a>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(attachment.file_size)} • {new Date(attachment.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <a
                        href={`http://localhost:4500/${attachment.file_path}`}
                        download={attachment.file_name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#01a370] transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </a>
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