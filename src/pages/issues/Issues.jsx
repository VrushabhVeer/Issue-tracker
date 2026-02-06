import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Filter,
  Plus,
  Search,
  Download,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "react-toastify";


// Import reusable components
import Button from '../../common/Button';
import Input from '../../common/Input';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import UserAvatar from '../../common/UserAvatar';
import EmptyState from '../../common/EmptyState';
import Select from '../../common/Select';
import { IssueApis, ProjectApis } from "../../api";

const IssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [projects, setProjects] = useState([]);
  const [sortField, setSortField] = useState("updated_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalDocs: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const navigate = useNavigate();

  // Fetch issues from API
  const fetchIssues = async (page = 1, filters = {}) => {
    try {
      setProcessing(true);
      const params = {
        page,
        limit: pagination.limit,
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        issue_type: typeFilter !== 'all' ? typeFilter : undefined,
        project_id: projectFilter !== 'all' ? projectFilter : undefined,
        ...filters
      };

      // Remove undefined values
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const response = await IssueApis.getIssues(params);
      // console.log("respon",response)
      if (response.success) {
        setIssues(response.data.docs);
        setFilteredIssues(response.data.docs);
        setPagination({
          page: response.data.page,
          limit: response.data.limit,
          totalDocs: response.data.totalDocs,
          totalPages: response.data.totalPages,
          hasNextPage: response.data.hasNextPage,
          hasPrevPage: response.data.hasPrevPage
        });
      }
    } catch (error) {
      console.error('Failed to fetch issues:', error);
      toast.error(error.message?.error_message || "Failed to fetch issues");
    } finally {
      setLoading(false);
      setProcessing(false);
    }
  };

  // Initial load and when filters change
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const projectRes = await ProjectApis.getProjectNames();
        if (projectRes.success) {
          setProjects(projectRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
      fetchIssues(1);
    };

    fetchInitialData();
  }, [searchTerm, statusFilter, priorityFilter, typeFilter, projectFilter]);

  const handlePageChange = (newPage) => {
    fetchIssues(newPage);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      const newDirection = sortDirection === "asc" ? "desc" : "asc";
      setSortDirection(newDirection);
      fetchIssues(1, { sort: `${newDirection === 'desc' ? '-' : ''}${field}` });
    } else {
      setSortField(field);
      setSortDirection("desc");
      fetchIssues(1, { sort: `-${field}` });
    }
  };

  const priorityBadge = (priority) => {
    const variants = {
      critical: 'danger',
      high: 'warning',
      medium: 'info',
      low: 'success',
      lowest: 'success'
    };
    return <Badge variant={variants[priority] || 'default'}>{priority}</Badge>;
  };

  const statusBadge = (status) => {
    const variants = {
      open: 'primary',
      in_progress: 'info',
      resolved: 'success',
      closed: 'default',
      reopened: 'warning'
    };
    return <Badge variant={variants[status] || 'default'}>{status.replace('_', ' ')}</Badge>;
  };

  const typeBadge = (type) => {
    const variants = {
      bug: 'danger',
      task: 'primary',
      story: 'success',
      epic: 'info'
    };
    return <Badge variant={variants[type] || 'default'}>{type}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01a370] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Issues
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Track and manage all issues across your projects
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <Button variant="secondary" icon={Download}>
                Export
              </Button>
              <Button
                onClick={() => navigate("/issues/new")}
                variant="primary"
                icon={Plus}
              >
                Create Issue
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <Input
              icon={Search}
              placeholder="Search issues by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-lg"
            />

            <div className="flex space-x-3">
              <Button
                variant={showFilters ? "primary" : "secondary"}
                onClick={() => setShowFilters(!showFilters)}
                icon={SlidersHorizontal}
                disabled={processing}
              >
                Filters
                {(statusFilter !== "all" || priorityFilter !== "all" || typeFilter !== "all" || projectFilter !== "all") && (
                  <span className="ml-2 bg-[#01a370] text-white text-xs px-2 py-0.5 rounded-full">
                    {[statusFilter, priorityFilter, typeFilter, projectFilter].filter(f => f !== "all").length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <Select
                label="Project"
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                disabled={processing}
                options={[
                  { value: "all", label: "All Projects" },
                  ...projects.map(p => ({ value: p._id, label: p.name }))
                ]}
              />
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                disabled={processing}
                options={[
                  { value: "all", label: "All Statuses" },
                  { value: "open", label: "Open" },
                  { value: "in_progress", label: "In Progress" },
                  { value: "resolved", label: "Resolved" },
                  { value: "closed", label: "Closed" },
                  { value: "reopened", label: "Reopened" }
                ]}
              />

              <Select
                label="Priority"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                disabled={processing}
                options={[
                  { value: "all", label: "All Priorities" },
                  { value: "lowest", label: "Lowest" },
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                  { value: "highest", label: "Highest" },
                  { value: "critical", label: "Critical" }
                ]}
              />

              <Select
                label="Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                disabled={processing}
                options={[
                  { value: "all", label: "All Types" },
                  { value: "bug", label: "Bug" },
                  { value: "task", label: "Task" },
                  { value: "story", label: "Story" },
                  { value: "epic", label: "Epic" }
                ]}
              />
            </div>
          )}
        </Card>

        {/* Issues Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-48"
                    onClick={() => handleSort("project_id")}
                  >
                    <div className="flex items-center">
                      Project
                      {sortField === "project_id" && (
                        sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-24"
                    onClick={() => handleSort("issue_type")}
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-28"
                    onClick={() => handleSort("priority")}
                  >
                    <div className="flex items-center">
                      Priority
                      {sortField === "priority" && (
                        sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-32"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {sortField === "status" && (
                        sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                    Assignee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                    Reporter
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIssues.length > 0 ? (
                  filteredIssues.map((issue) => (
                    <tr
                      key={issue._id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/issues/details/${issue._id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{issue.project_id?.name}</div>
                        <div className="text-xs font-medium text-[#01a370]">{issue.project_id?.key}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-md">{issue.title}</div>
                        <div className="text-xs text-gray-500">
                          Updated {new Date(issue.updated_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {typeBadge(issue.issue_type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {priorityBadge(issue.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {statusBadge(issue.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <UserAvatar user={issue.assignee_id} size="small" />
                          <div className="ml-2 text-sm font-medium text-gray-900 truncate max-w-xs">
                            {issue.assignee_id?.name || 'Unassigned'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <UserAvatar user={issue.reporter_id} size="small" />
                          <div className="ml-2 text-sm text-gray-900 truncate max-w-xs">{issue.reporter_id?.name || 'Unknown'}</div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <EmptyState
                        icon={Search}
                        title="No issues found"
                        description="Try adjusting your search or filter to find what you're looking for."
                        action={
                          <Button
                            variant="primary"
                            icon={Plus}
                            onClick={() => navigate("/issues/new")}
                            disabled={processing}
                          >
                            Create New Issue
                          </Button>
                        }
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.totalDocs)}
                  </span> of{' '}
                  <span className="font-medium">{pagination.totalDocs}</span> results
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="small"
                    icon={ChevronLeft}
                    disabled={!pagination.hasPrevPage || processing}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    Previous
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={pagination.page === pageNum ? "primary" : "outline"}
                          size="small"
                          onClick={() => handlePageChange(pageNum)}
                          className="min-w-[2.5rem]"
                          disabled={processing}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="small"
                    icon={ChevronRight}
                    iconPosition="right"
                    disabled={!pagination.hasNextPage || processing}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default IssuesPage;