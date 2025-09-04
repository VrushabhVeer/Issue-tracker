import { useState } from "react";
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
} from "lucide-react";
import { toast } from "react-toastify";

// Import reusable components
import Button from "../common/Button";
import Input from "../common/Input";
import TextArea from "../common/TextArea";
import Select from "../common/Select";
import Card from "../common/Card";
import LoadingSpinner from "../common/LoadingSpinner";
import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";
import Modal from "../common/Modal";

const CreateIssue = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const [attachments, setAttachments] = useState([]);
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
    reporter_id: "",
    assignee_id: "",
    due_date: "",
    estimated_time: "",
    actual_time: "",
    environment: "",
    sprint_id: "",
    is_blocked: false,
    blocked_reason: "",
  });

  // Sample data - in real app, you'd fetch these from your API
  const projects = [
    { _id: "1", name: "Website Redesign", key: "WEB" },
    { _id: "2", name: "Mobile App", key: "MOB" },
    { _id: "3", name: "API Services", key: "API" },
  ];

  const sprints = [
    { _id: "1", name: "Sprint 1 - Jan 2023" },
    { _id: "2", name: "Sprint 2 - Feb 2023" },
    { _id: "3", name: "Sprint 3 - Mar 2023" },
  ];

  const users = [
    { _id: "1", name: "Sarah Johnson", avatar: null },
    { _id: "2", name: "Michael Chen", avatar: null },
    { _id: "3", name: "Emma Davis", avatar: null },
    { _id: "4", name: "Alex Rodriguez", avatar: null },
    { _id: "5", name: "You", avatar: null },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

  // const handleFileUpload = (e) => {
  //   const files = Array.from(e.target.files);
  //   const validFiles = files.filter(file => {
  //     const validTypes = [
  //       'image/jpeg',
  //       'image/png',
  //       'application/pdf',
  //       'application/msword',
  //       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //       'application/vnd.ms-excel',
  //       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  //     ];

  //     if (!validTypes.includes(file.type)) {
  //       toast.error(`Invalid file type: ${file.name}`);
  //       return false;
  //     }

  //     if (file.size > 10 * 1024 * 1024) {
  //       toast.error(`File too large: ${file.name} (max 10MB)`);
  //       return false;
  //     }

  //     return true;
  //   });

  //   setAttachments(prev => [...prev, ...validFiles]);
  // };

  // const removeAttachment = (index) => {
  //   setAttachments(prev => prev.filter((_, i) => i !== index));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        labels,
        subtasks: subtasks.map(({ id, ...subtask }) => subtask),
        // In a real app, you would add the current user as reporter
        reporter_id: "5", // Hardcoded for demo - replace with actual user ID
      };

      // Convert empty strings to null for number fields
      if (!payload.story_points) payload.story_points = null;
      if (!payload.estimated_time) payload.estimated_time = null;
      if (!payload.actual_time) payload.actual_time = null;

      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(payload).forEach((key) => {
        if (
          payload[key] !== null &&
          payload[key] !== undefined &&
          payload[key] !== ""
        ) {
          if (Array.isArray(payload[key])) {
            payload[key].forEach((item) => {
              formDataToSend.append(key, item);
            });
          } else {
            formDataToSend.append(key, payload[key]);
          }
        }
      });

      // Append attachments
      // attachments.forEach(file => {
      //   formDataToSend.append('attachments', file);
      // });

      console.log("Payload:", payload);

      // Uncomment to send to your API
      /*
      const response = await fetch('http://localhost:4500/api/issues', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Issue created successfully!');
        navigate('/issues');
      } else {
        throw new Error(data.error || 'Failed to create issue');
      }
      */

      toast.success("Issue created successfully!");
      navigate("/issues");
    } catch (error) {
      toast.error(error.message);
      console.error("Error creating issue:", error);
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
    const user = users.find((user) => user._id === assigneeId);
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
                Create New Issue
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Add a new issue to track and manage
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
              <Select
                label="Project"
                name="project_id"
                value={formData.project_id}
                onChange={handleChange}
                required
                options={[
                  { value: "", label: "Select a project" },
                  ...projects.map((project) => ({
                    value: project._id,
                    label: `${project.name} (${project.key})`,
                  })),
                ]}
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

                {/* Assignee */}
                <Select
                  label="Assignee"
                  name="assignee_id"
                  value={formData.assignee_id}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Unassigned" },
                    ...users.map((user) => ({
                      value: user._id,
                      label: user.name,
                    })),
                  ]}
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Due Date */}
                <Input
                  label="Due Date"
                  name="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={handleChange}
                  icon={Calendar}
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

              {/* Environment */}
              <Input
                label="Environment"
                name="environment"
                value={formData.environment}
                onChange={handleChange}
                placeholder="e.g., Production, Development, Staging"
              />

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
                icon={Plus}
              >
                Create Issue
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
              <Select
                label="Assignee"
                name="assignee_id"
                value={
                  editingSubtask
                    ? editingSubtask.assignee_id
                    : newSubtask.assignee_id
                }
                onChange={handleSubtaskChange}
                options={[
                  { value: "", label: "Unassigned" },
                  ...users.map((user) => ({
                    value: user._id,
                    label: user.name,
                  })),
                ]}
              />
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
