import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Upload,
  X,
  Calendar,
  Clock,
  Tag,
  Paperclip,
  ListTodo,
  Building2,
  User,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";

// Import reusable components
import Button from "../../common/Button";
import Input from "../../common/Input";
import TextArea from "../../common/TextArea";
import Select from "../../common/Select";
import Card from "../../common/Card";
import LoadingSpinner from "../../common/LoadingSpinner";
import Badge from "../../common/Badge";
import EmptyState from "../../common/EmptyState";
import Modal from "../../common/Modal";
import UserSelect from "../../common/UserSelect";
import { AuthAPI, ProjectApis } from "../../api";
import ProjectSelect from "../../common/ProjectSelect";
import IssueApis from "../../api/endpoints/issuesEndpoint";

const CreateIssue = ({ companyId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [companyUsers, setCompanyUsers] = useState([]);
  const [subtasks, setSubtasks] = useState([]);
  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
  const [editingSubtask, setEditingSubtask] = useState(null);
  const [newSubtask, setNewSubtask] = useState({
    title: "",
    description: "",
    status: "open",
    assignee_id: "",
    due_date: "",
  });
  const [labels, setLabels] = useState([]);
  const [newLabel, setNewLabel] = useState("");
  const [formData, setFormData] = useState({
    project_id: "",
    title: "",
    summary: "",
    description: "",
    issue_type: "task",
    status: "open",
    story_points: "",
    priority: "medium",
    reporter_id: null,
    assignee_id: null,
    due_date: "",
    estimated_time: "",
    actual_time: "",
    environment: "",
    sprint_id: "",
    is_blocked: false,
    blocked_reason: "",
  });
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const sprints = [
    { _id: "1", name: "Sprint 1 - Jan 2023" },
    { _id: "2", name: "Sprint 2 - Feb 2023" },
    { _id: "3", name: "Sprint 3 - Mar 2023" },
  ];

  // Fetch users from API
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('edit');
    if (id) {
      setIsEditMode(true);
      setEditId(id);
      fetchIssueForEdit(id);
    }
    fetchUsers();
    fetchProjectsSimple();
  }, []);

  const fetchIssueForEdit = async (id) => {
    try {
      setLoading(true);
      const response = await IssueApis.getIssueById(id);
      if (response.success) {
        const issue = response.data;
        setFormData({
          project_id: issue.project_id?._id || "",
          title: issue.title || "",
          summary: issue.summary || "",
          description: issue.description || "",
          issue_type: issue.issue_type || "task",
          status: issue.status || "open",
          story_points: issue.story_points || "",
          priority: issue.priority || "medium",
          reporter_id: issue.reporter_id?._id || null,
          assignee_id: issue.assignee_id?._id || null,
          due_date: issue.due_date ? issue.due_date.split('T')[0] : "",
          estimated_time: issue.estimated_time || "",
          actual_time: issue.actual_time || "",
          environment: issue.environment || "",
          sprint_id: issue.sprint_id?._id || "",
          is_blocked: issue.is_blocked || false,
          blocked_reason: issue.blocked_reason || "",
        });
        setLabels(issue.labels || []);
        if (issue.subtasks) {
          setSubtasks(issue.subtasks.map(s => ({ ...s, id: s._id })));
        }
      }
    } catch (error) {
      console.error('Error fetching issue for edit:', error);
      toast.error('Failed to load issue data');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectsSimple = async () => {
    try {
      setLoadingProjects(true);
      const response = await ProjectApis.getProjectNames();
      setProjects(response || []);
    } catch (error) {
      console.error('Error fetching projects list:', error);
      toast.error(error.message?.error_message ||
        error.error_message || 'Failed to fetch projects');
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchUsers = async () => {
    // If companyId is not passed as prop, try to get from localStorage/auth context
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const cid = companyId || storedUser?.company_id;

    if (!cid) {
      setUsersError('Company ID is required');
      return;
    }
    setUsersLoading(true);
    setUsersError('');
    try {
      const response = await AuthAPI.getAllCompanyMembers(cid);
      if (response.error) {
        // setUsersError(response.error || 'Failed to fetch team members');
        console.error('Failed to fetch members:', response.error);
      } else {
        setCompanyUsers(response.users || []);
      }
    } catch (error) {
      console.error('Error fetching company members:', error);

      const errorMessage = error.message?.error_message ||
        error.error_message ||
        'Failed to load team members. Please try again.';

      setUsersError(errorMessage);
    } finally {
      setUsersLoading(false);
    }
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAssigneeChange = (assigneeId) => {
    setFormData(prev => ({
      ...prev,
      assignee_id: assigneeId
    }));
  };

  const handleReporterChange = (reporterId) => {
    setFormData(prev => ({
      ...prev,
      reporter_id: reporterId
    }));
  };

  const handleSubtaskChange = (e) => {
    const { name, value } = e.target;
    if (editingSubtask) {
      setEditingSubtask((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setNewSubtask((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubtaskAssigneeChange = (assigneeId) => {
    if (editingSubtask) {
      setEditingSubtask((prev) => ({
        ...prev,
        assignee_id: assigneeId
      }));
    } else {
      setNewSubtask((prev) => ({
        ...prev,
        assignee_id: assigneeId
      }));
    }
  };

  const openSubtaskModal = (subtask = null) => {
    if (subtask) {
      setEditingSubtask({ ...subtask });
    } else {
      setEditingSubtask(null);
      setNewSubtask({
        title: "",
        description: "",
        status: "open",
        assignee_id: "",
        due_date: "",
      });
    }
    setIsSubtaskModalOpen(true);
  };

  const closeSubtaskModal = () => {
    setIsSubtaskModalOpen(false);
    setEditingSubtask(null);
  };

  const saveSubtask = () => {
    if (!editingSubtask?.title && !newSubtask.title) {
      toast.error("Subtask title is required");
      return;
    }

    if (editingSubtask) {
      // Update existing subtask
      setSubtasks((prev) =>
        prev.map((subtask) =>
          subtask.id === editingSubtask.id ? editingSubtask : subtask
        )
      );
      toast.success("Subtask updated successfully");
    } else {
      // Add new subtask
      setSubtasks((prev) => [
        ...prev,
        {
          ...newSubtask,
          id: Date.now().toString(),
        },
      ]);

      setNewSubtask({
        title: "",
        description: "",
        status: "open",
        assignee_id: "",
        due_date: "",
      });
      toast.success("Subtask added successfully");
    }

    closeSubtaskModal();
  };

  const removeSubtask = (id) => {
    setSubtasks((prev) => prev.filter((subtask) => subtask.id !== id));
    toast.success("Subtask removed");
  };

  const addLabel = () => {
    if (!newLabel.trim()) return;

    setLabels((prev) => [...prev, newLabel.trim()]);
    setNewLabel("");
  };

  const removeLabel = (index) => {
    setLabels((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        labels,
        subtasks: subtasks.map(({ id, ...subtask }) => subtask),
      };

      // Convert empty strings to null for number fields
      if (!payload.story_points) payload.story_points = null;
      if (!payload.estimated_time) payload.estimated_time = null;
      if (!payload.actual_time) payload.actual_time = null;

      if (isEditMode) {
        await IssueApis.updateIssue(editId, payload);
        toast.success("Issue updated successfully!");
        navigate(`/issues/${editId}`);
      } else {
        await IssueApis.createIssue(payload);
        toast.success("Issue created successfully!");
        navigate("/issues");
      }
    } catch (error) {
      toast.error(error.message?.error_message || error.message || "Failed to save issue");
      console.error("Error saving issue:", error);
    } finally {
      setLoading(false);
    }
  };




  const getStatusBadgeVariant = (status) => {
    const variants = {
      open: "primary",
      in_progress: "info",
      resolved: "success",
      closed: "default",
    };
    return variants[status] || "default";
  };

  const getAssigneeName = (assigneeId) => {
    const user = companyUsers.find((user) => user._id === assigneeId);
    return user ? user.name : "Unassigned";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="small"
              onClick={() => navigate("/issues")}
              icon={ArrowLeft}
              className="mr-4"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? "Edit Issue" : "Create New Issue"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isEditMode ? "Update the details of this issue" : "Add a new issue to track and manage"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card title="Issue Details" className="overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6 space-y-6">
              {/* Project Selection */}
              <ProjectSelect
                label="Project"
                projects={projects}
                value={formData.project_id}
                onChange={(projectId) => setFormData(prev => ({ ...prev, project_id: projectId }))}
                required
                icon={Building2}
                loading={loadingProjects}
                disabled={loadingProjects}
                helperText="Select the project this issue belongs to"
              />

              {/* Title */}
              <Input
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={200}
                placeholder="Enter issue title"
              />

              {/* Description */}
              <TextArea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Detailed description of the issue"
              />

              {/* Type, Status, Priority */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Issue Type */}
                <Select
                  label="Type"
                  name="issue_type"
                  value={formData.issue_type}
                  onChange={handleChange}
                  options={[
                    { value: "bug", label: "Bug" },
                    { value: "task", label: "Task" },
                    { value: "story", label: "Story" },
                    { value: "epic", label: "Epic" },
                  ]}
                />

                {/* Status */}
                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={[
                    { value: "open", label: "Open" },
                    { value: "in_progress", label: "In Progress" },
                    { value: "resolved", label: "Resolved" },
                    { value: "closed", label: "Closed" },
                    { value: "reopened", label: "Reopened" },
                  ]}
                />

                {/* Priority */}
                <Select
                  label="Priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  options={[
                    { value: "lowest", label: "Lowest" },
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "High" },
                    { value: "highest", label: "Highest" },
                    { value: "critical", label: "Critical" },
                  ]}
                />
              </div>

              {/* Story Points, Sprint, Due Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Story Points */}
                <Input
                  label="Story Points"
                  name="story_points"
                  type="number"
                  value={formData.story_points}
                  onChange={handleChange}
                  min="0"
                  max="20"
                  placeholder="0"
                />

                {/* Sprint */}
                <Select
                  label="Sprint"
                  name="sprint_id"
                  value={formData.sprint_id}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "No Sprint" },
                    ...sprints.map((sprint) => ({
                      value: sprint._id,
                      label: sprint.name,
                    })),
                  ]}
                />

                {/* Due Date */}
                <Input
                  label="Due Date"
                  name="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={handleChange}
                  icon={Calendar}
                />
              </div>

              {/* Environment, Estimated Time, Actual Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Environment */}
                <Input
                  label="Environment"
                  name="environment"
                  value={formData.environment}
                  onChange={handleChange}
                  placeholder="e.g., Production, Development, Staging"
                />

                {/* Estimated Time */}
                <Input
                  label="Estimated Time (hours)"
                  name="estimated_time"
                  type="number"
                  value={formData.estimated_time}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  placeholder="0"
                  icon={Clock}
                />

                {/* Actual Time */}
                <Input
                  label="Actual Time (hours)"
                  name="actual_time"
                  type="number"
                  value={formData.actual_time}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  placeholder="0"
                  icon={Clock}
                />
              </div>

              {/* Assignee, Reporter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assignee - Using UserSelect component */}
                <div className="relative">
                  <UserSelect
                    label="Assignee"
                    companyMembers={companyUsers}
                    value={formData.assignee_id}
                    onChange={handleAssigneeChange}
                    icon={User}
                    helperText="Select who will work on this issue"
                    loading={usersLoading}
                    disabled={usersLoading || !!usersError}
                  />
                  {usersLoading && (
                    <div className="absolute right-3 top-9">
                      <LoadingSpinner size="small" className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Reporter - Using UserSelect component */}
                <div className="relative">
                  <UserSelect
                    label="Reporter"
                    companyMembers={companyUsers}
                    value={formData.reporter_id}
                    onChange={handleReporterChange}
                    icon={User}
                    helperText="Select who reported this issue"
                    loading={usersLoading}
                    disabled={usersLoading || !!usersError}
                  />
                  {usersLoading && (
                    <div className="absolute right-3 top-9">
                      <LoadingSpinner size="small" className="text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {usersError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                    <span className="text-red-700 text-sm">{usersError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={fetchUsers}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Labels */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Labels
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {labels.map((label, index) => (
                    <Badge
                      key={index}
                      variant="primary"
                      className="flex items-center gap-1"
                    >
                      {label}
                      <button
                        type="button"
                        onClick={() => removeLabel(index)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Add a label"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLabel();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addLabel}
                    disabled={!newLabel.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Subtasks */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Subtasks
                  </label>
                  <Button
                    type="button"
                    variant="secondary"
                    size="small"
                    onClick={() => openSubtaskModal()}
                    icon={Plus}
                  >
                    Add Subtask
                  </Button>
                </div>

                {subtasks.length === 0 ? (
                  <EmptyState
                    icon={ListTodo}
                    title="No subtasks yet"
                    description="Add subtasks to break down this issue into smaller, manageable pieces."
                    action={
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => openSubtaskModal()}
                        icon={Plus}
                      >
                        Add First Subtask
                      </Button>
                    }
                    className="py-8"
                  />
                ) : (
                  <div className="space-y-3">
                    {subtasks.map((subtask) => (
                      <div
                        key={subtask.id}
                        className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => openSubtaskModal(subtask)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {subtask.title}
                            </h4>
                            {subtask.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {subtask.description}
                              </p>
                            )}
                          </div>
                          <div className="ml-4 flex flex-col items-end space-y-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant={getStatusBadgeVariant(subtask.status)}>
                                {subtask.status.replace("_", " ")}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {getAssigneeName(subtask.assignee_id)}
                              </span>
                            </div>
                            {subtask.due_date && (
                              <span className="text-xs text-gray-500">
                                Due: {new Date(subtask.due_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/issues")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={!formData.project_id || !formData.title}
                icon={isEditMode ? Edit : Plus}
              >
                {isEditMode ? "Update Issue" : "Create Issue"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Subtask Modal */}
        <Modal
          isOpen={isSubtaskModalOpen}
          onClose={closeSubtaskModal}
          title={editingSubtask ? "Edit Subtask" : "Add New Subtask"}
          size="medium"
        >
          <div className="space-y-4">
            <Input
              label="Title"
              name="title"
              value={editingSubtask ? editingSubtask.title : newSubtask.title}
              onChange={handleSubtaskChange}
              required
              placeholder="Subtask title"
            />
            <TextArea
              label="Description"
              name="description"
              value={
                editingSubtask
                  ? editingSubtask.description
                  : newSubtask.description
              }
              onChange={handleSubtaskChange}
              rows={3}
              placeholder="Subtask description"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Status"
                name="status"
                value={
                  editingSubtask ? editingSubtask.status : newSubtask.status
                }
                onChange={handleSubtaskChange}
                options={[
                  { value: "open", label: "Open" },
                  { value: "in_progress", label: "In Progress" },
                  { value: "resolved", label: "Resolved" },
                  { value: "closed", label: "Closed" },
                ]}
              />

              {/* Subtask Assignee - Using UserSelect component */}
              <div className="relative">
                <UserSelect
                  label="Assignee"
                  companyMembers={companyUsers}
                  value={
                    editingSubtask
                      ? editingSubtask.assignee_id
                      : newSubtask.assignee_id
                  }
                  onChange={handleSubtaskAssigneeChange}
                  icon={User}
                  helperText="Select who will work on this subtask"
                  loading={usersLoading}
                  disabled={usersLoading || !!usersError}
                />
                {usersLoading && (
                  <div className="absolute right-3 top-9">
                    <LoadingSpinner size="small" className="text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            <Input
              label="Due Date"
              name="due_date"
              type="date"
              value={
                editingSubtask ? editingSubtask.due_date : newSubtask.due_date
              }
              onChange={handleSubtaskChange}
            />

            {editingSubtask && (
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  removeSubtask(editingSubtask.id);
                  closeSubtaskModal();
                }}
                className="w-full"
              >
                Remove Subtask
              </Button>
            )}

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={closeSubtaskModal}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={saveSubtask}
                className="flex-1"
              >
                {editingSubtask ? "Update Subtask" : "Add Subtask"}
              </Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default CreateIssue;
