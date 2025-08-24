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
  Paperclip
} from "lucide-react";
import { toast } from 'react-toastify';

// Import reusable components
import Button from '../common/Button';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Select from '../common/Select';
import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';

const CreateIssue = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [formData, setFormData] = useState({
    project_id: "",
    title: "",
    summary: "",
    description: "",
    issue_type: "task",
    priority: "medium",
    assignee_id: "",
    due_date: "",
    estimated_time: "",
    labels: "",
    environment: ""
  });

  // Sample data - in real app, you'd fetch these from your API
  const projects = [
    { _id: "1", name: "Website Redesign", key: "WEB" },
    { _id: "2", name: "Mobile App", key: "MOB" },
    { _id: "3", name: "API Services", key: "API" }
  ];

  const users = [
    { _id: "1", name: "Sarah Johnson", avatar: null },
    { _id: "2", name: "Michael Chen", avatar: null },
    { _id: "3", name: "Emma Davis", avatar: null },
    { _id: "4", name: "Alex Rodriguez", avatar: null },
    { _id: "5", name: "You", avatar: null }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const validTypes = [
        'image/jpeg', 
        'image/png', 
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!validTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}`);
        return false;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File too large: ${file.name} (max 10MB)`);
        return false;
      }
      
      return true;
    });

    setAttachments(prev => [...prev, ...validFiles]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append attachments
      attachments.forEach(file => {
        formDataToSend.append('attachments', file);
      });

      // const response = await fetch('http://localhost:4500/api/issues', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: formDataToSend
      // });

      // const data = await response.json();

      // if (response.ok) {
      //   toast.success('Issue created successfully!');
      //   navigate('/issues');
      // } else {
      //   throw new Error(data.error || 'Failed to create issue');
      // }
    } catch (error) {
      toast.error(error.message);
      console.error('Error creating issue:', error);
    } finally {
      setLoading(false);
    }
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
              onClick={() => navigate('/issues')}
              icon={ArrowLeft}
              className="mr-4"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Issue</h1>
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
                  ...projects.map(project => ({
                    value: project._id,
                    label: `${project.name} (${project.key})`
                  }))
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

              {/* Summary */}
              <TextArea
                label="Summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={2}
                maxLength={500}
                placeholder="Brief summary of the issue"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    { value: "epic", label: "Epic" }
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
                    { value: "critical", label: "Critical" }
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assignee */}
                <Select
                  label="Assignee"
                  name="assignee_id"
                  value={formData.assignee_id}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Unassigned" },
                    ...users.map(user => ({
                      value: user._id,
                      label: user.name
                    }))
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {/* Environment */}
                <Input
                  label="Environment"
                  name="environment"
                  value={formData.environment}
                  onChange={handleChange}
                  placeholder="e.g., Production, Development"
                />
              </div>

              {/* Labels */}
              <Input
                label="Labels"
                name="labels"
                value={formData.labels}
                onChange={handleChange}
                placeholder="Comma-separated labels (e.g., bug, mobile, ui)"
                icon={Tag}
              />

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#01a370] hover:text-[#018a60]">
                        <span>Upload files</span>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="sr-only"
                          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF, DOC, XLS up to 10MB
                    </p>
                  </div>
                </div>

                {/* Attachment preview */}
                {attachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected files:</h4>
                    <div className="space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded-md">
                          <div className="flex items-center space-x-2">
                            <Paperclip className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700 truncate max-w-xs">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/issues')}
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
      </main>
    </div>
  );
};

export default CreateIssue;