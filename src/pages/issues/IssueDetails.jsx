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
import Modal from '../../common/Modal';
import UserSelect from '../../common/UserSelect';
import { IssueApis, SprintApis, AuthAPI } from "../../api";

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
  const [projectSprints, setProjectSprints] = useState([]);
  const [companyUsers, setCompanyUsers] = useState([]);
  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
  const [isDeleteSubtaskModalOpen, setIsDeleteSubtaskModalOpen] = useState(false);
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [subtaskToDelete, setSubtaskToDelete] = useState(null);
  const [subtaskFormData, setSubtaskFormData] = useState({
    title: "",
    description: "",
    status: "open",
    assignee_id: "",
    due_date: ""
  });

  const fetchUsers = async (companyId) => {
    try {
      const response = await AuthAPI.getAllCompanyMembers(companyId);
      if (response && response.users) {
        setCompanyUsers(response.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleOpenSubtaskModal = (subtask = null) => {
    if (subtask) {
      setSelectedSubtask(subtask);
      setSubtaskFormData({
        title: subtask.title,
        description: subtask.description || "",
        status: subtask.status,
        assignee_id: subtask.assignee_id?._id || subtask.assignee_id || "",
        due_date: subtask.due_date ? subtask.due_date.split('T')[0] : ""
      });
    } else {
      setSelectedSubtask(null);
      setSubtaskFormData({
        title: "",
        description: "",
        status: "open",
        assignee_id: "",
        due_date: ""
      });
    }
    setIsSubtaskModalOpen(true);
  };

  const handleSaveSubtask = async () => {
    if (!subtaskFormData.title.trim()) {
      toast.error("Subtask title is required");
      return;
    }

    try {
      if (selectedSubtask) {
        // Update subtask: find index and replace in array, then update issue
        const updatedSubtasks = issue.subtasks.map(s =>
          s._id === selectedSubtask._id ? { ...s, ...subtaskFormData } : s
        );
        const response = await IssueApis.updateIssue(id, { subtasks: updatedSubtasks });
        if (response.success) {
          setIssue(response.data);
          toast.success("Subtask updated");
        }
      } else {
        // Add new subtask
        const response = await IssueApis.addSubtask(id, subtaskFormData);
        if (response.success) {
          setIssue(response.data);
          toast.success("Subtask added");
        }
      }
      setIsSubtaskModalOpen(false);
    } catch (error) {
      toast.error(error.message?.error_message || "Failed to save subtask");
    }
  };

  const handleDeleteSubtask = async () => {
    if (!subtaskToDelete) return;

    try {
      const updatedSubtasks = issue.subtasks.filter(s => s._id !== subtaskToDelete._id);
      const response = await IssueApis.updateIssue(id, { subtasks: updatedSubtasks });
      if (response.success) {
        setIssue(response.data);
        toast.success("Subtask deleted");
      }
      setIsDeleteSubtaskModalOpen(false);
      setSubtaskToDelete(null);
    } catch (error) {
      toast.error("Failed to delete subtask");
    }
  };

  const fetchIssue = async () => {
    try {
      setLoading(true);
      const response = await IssueApis.getIssueById(id);
      if (response.success) {
        setIssue(response.data);
        if (response.data.project_id) {
          fetchSprints(response.data.project_id._id);
        }
        // Fetch users if company_id is available
        const companyId = localStorage.getItem("company_id");
        if (companyId) {
          fetchUsers(companyId);
        }
      }
    } catch (error) {
      console.error("Fetch issue error:", error);
      toast.error(error.message?.error_message || "Failed to load issue details");
    } finally {
      setLoading(false);
    }
  };

  const fetchSprints = async (projectId) => {
    try {
      const response = await SprintApis.getProjectSprints(projectId);
      if (response.success) {
        setProjectSprints(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching sprints:", error);
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

  const getStatusBadgeVariant = (status) => {
    const variants = {
      open: 'primary',
      in_progress: 'info',
      resolved: 'success',
      closed: 'default',
      reopened: 'warning'
    };
    return variants[status] || 'default';
  };

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

            {/* Subtasks */}
            <Card
              title="Subtasks"
              actions={
                <Button
                  onClick={() => handleOpenSubtaskModal()}
                  variant="primary"
                  size="small"
                  icon={Plus}
                >
                  Add Subtask
                </Button>
              }
            >
              {issue.subtasks.length > 0 ? (
                <div className="space-y-3">
                  {issue.subtasks.map((subtask) => (
                    <div
                      key={subtask._id}
                      className="group flex items-center justify-between p-3 border border-gray-200 rounded-md hover:border-[#01a370] hover:bg-gray-50 transition-all cursor-pointer"
                      onClick={() => handleOpenSubtaskModal(subtask)}
                    >
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#01a370]">{subtask.title}</h4>
                          {subtask.description && (
                            <p className="text-sm text-gray-500 line-clamp-1">{subtask.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-end">
                          <Badge variant={getStatusBadgeVariant(subtask.status)} className="scale-75">
                            {subtask.status.replace("_", " ")}
                          </Badge>
                          {subtask.due_date && (
                            <span className="text-[10px] text-gray-400 mt-1">
                              Due: {new Date(subtask.due_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSubtaskToDelete(subtask);
                            setIsDeleteSubtaskModalOpen(true);
                          }}
                          className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No subtasks yet.</p>
              )}
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details Card */}
            <Card title="Details">
              <div className="space-y-4">
                {/* Status */}
                <div className="group transition-all">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Select
                    value={issue.status}
                    onChange={(e) => handleUpdateField('status', e.target.value)}
                    options={statusOptions}
                    containerClassName="relative"
                    className="appearance-none !pr-3 bg-white cursor-pointer hover:border-[#01a370] transition-colors"
                  />
                </div>

                {/* Assignee */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 border border-gray-200 rounded-md">
                    <UserAvatar user={issue.assignee_id} size="small" />
                    <span className="text-sm text-gray-900">{issue.assignee_id?.name || 'Unassigned'}</span>
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 capitalize">
                    {issue.priority}
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 capitalize">
                    {issue.issue_type}
                  </div>
                </div>

                {/* Sprint */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sprint</label>
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900">
                    {issue.sprint_id?.name || 'No Sprint'}
                  </div>
                </div>

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

      {/* Subtask Modal */}
      <Modal
        isOpen={isSubtaskModalOpen}
        onClose={() => setIsSubtaskModalOpen(false)}
        title={selectedSubtask ? "Edit Subtask" : "Add New Subtask"}
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={subtaskFormData.title}
            onChange={(e) => setSubtaskFormData({ ...subtaskFormData, title: e.target.value })}
            placeholder="Subtask title"
            required
          />
          <TextArea
            label="Description"
            value={subtaskFormData.description}
            onChange={(e) => setSubtaskFormData({ ...subtaskFormData, description: e.target.value })}
            placeholder="Optional details..."
            rows={3}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Status"
              value={subtaskFormData.status}
              onChange={(e) => setSubtaskFormData({ ...subtaskFormData, status: e.target.value })}
              options={statusOptions}
            />
            <UserSelect
              label="Assignee"
              companyMembers={companyUsers}
              value={subtaskFormData.assignee_id}
              onChange={(val) => setSubtaskFormData({ ...subtaskFormData, assignee_id: val })}
              icon={User}
              helperText="Select who will work on this subtask"
            />
          </div>
          <Input
            label="Due Date"
            type="date"
            value={subtaskFormData.due_date}
            onChange={(e) => setSubtaskFormData({ ...subtaskFormData, due_date: e.target.value })}
          />

          <div className="flex space-x-3 pt-4 border-t border-gray-100 mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsSubtaskModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveSubtask}
              className="flex-1"
            >
              {selectedSubtask ? "Update Subtask" : "Add Subtask"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteSubtaskModalOpen}
        onClose={() => setIsDeleteSubtaskModalOpen(false)}
        title="Delete Subtask"
      >
        <div className="py-4">
          <div className="flex items-center space-x-3 text-red-600 mb-4">
            <AlertCircle className="h-6 w-6" />
            <span className="font-bold">Warning</span>
          </div>
          <p className="text-gray-600">
            Are you sure you want to delete subtask <strong>"{subtaskToDelete?.title}"</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3 mt-8">
            <Button variant="secondary" onClick={() => setIsDeleteSubtaskModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteSubtask}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default IssueDetails;