import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Filter, 
  Plus, 
  Search, 
  Download,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Import reusable components
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';
import Badge from '../common/Badge';
import UserAvatar from '../common/UserAvatar';
import EmptyState from '../common/EmptyState';
import Select from '../common/Select';

const IssuesPage = () => {
  const [issues, setIssues] = useState([
    { 
      id: 1, 
      key: 'WEB-101', 
      title: 'Login page not responsive on mobile devices', 
      type: 'bug', 
      priority: 'high', 
      status: 'open',
      assignee: { id: 1, name: 'Sarah Johnson', avatar: null }, 
      reporter: { id: 2, name: 'Michael Chen', avatar: null }, 
      created: '2023-06-15', 
      updated: '2023-06-18',
      dueDate: '2023-06-25',
      storyPoints: 3
    },
    { 
      id: 2, 
      key: 'API-202', 
      title: 'API rate limiting not working correctly', 
      type: 'bug', 
      priority: 'medium', 
      status: 'in progress', 
      assignee: { id: 3, name: 'Emma Davis', avatar: null }, 
      reporter: { id: 4, name: 'Alex Rodriguez', avatar: null }, 
      created: '2023-06-14', 
      updated: '2023-06-17',
      dueDate: '2023-06-23',
      storyPoints: 5
    },
    { 
      id: 3, 
      key: 'ANA-305', 
      title: 'Dashboard chart data incorrect for date ranges', 
      type: 'bug', 
      priority: 'high', 
      status: 'open', 
      assignee: { id: 5, name: 'You', avatar: null }, 
      reporter: { id: 6, name: 'Lisa Taylor', avatar: null }, 
      created: '2023-06-14', 
      updated: '2023-06-16',
      dueDate: '2023-06-22',
      storyPoints: 2
    },
    { 
      id: 4, 
      key: 'MOB-412', 
      title: 'User profile image upload fails for large files', 
      type: 'bug', 
      priority: 'low', 
      status: 'resolved', 
      assignee: { id: 7, name: 'David Wilson', avatar: null }, 
      reporter: { id: 8, name: 'Maria Garcia', avatar: null }, 
      created: '2023-06-13', 
      updated: '2023-06-15',
      dueDate: '2023-06-20',
      storyPoints: 8
    },
    { 
      id: 5, 
      key: 'NOT-518', 
      title: 'Email notifications delayed by several hours', 
      type: 'task', 
      priority: 'medium', 
      status: 'in progress', 
      assignee: { id: 3, name: 'Emma Davis', avatar: null }, 
      reporter: { id: 1, name: 'Sarah Johnson', avatar: null }, 
      created: '2023-06-12', 
      updated: '2023-06-15',
      dueDate: '2023-06-19',
      storyPoints: 5
    },
    { 
      id: 6, 
      key: 'WEB-629', 
      title: 'Implement dark mode across application', 
      type: 'story', 
      priority: 'high', 
      status: 'open', 
      assignee: { id: 5, name: 'You', avatar: null }, 
      reporter: { id: 2, name: 'Michael Chen', avatar: null }, 
      created: '2023-06-11', 
      updated: '2023-06-14',
      dueDate: '2023-06-30',
      storyPoints: 13
    },
    { 
      id: 7, 
      key: 'API-734', 
      title: 'Add pagination to user list endpoint', 
      type: 'task', 
      priority: 'medium', 
      status: 'closed', 
      assignee: { id: 4, name: 'Alex Rodriguez', avatar: null }, 
      reporter: { id: 7, name: 'David Wilson', avatar: null }, 
      created: '2023-06-10', 
      updated: '2023-06-13',
      dueDate: '2023-06-17',
      storyPoints: 3
    },
    { 
      id: 8, 
      key: 'MOB-846', 
      title: 'Mobile app crashes on iOS when switching tabs quickly', 
      type: 'bug', 
      priority: 'critical', 
      status: 'open', 
      assignee: { id: 8, name: 'Maria Garcia', avatar: null }, 
      reporter: { id: 5, name: 'You', avatar: null }, 
      created: '2023-06-09', 
      updated: '2023-06-12',
      dueDate: '2023-06-16',
      storyPoints: 5
    }
  ]);

  const [filteredIssues, setFilteredIssues] = useState(issues);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortField, setSortField] = useState("updated");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Filter and sort issues based on current filters and search term
  useEffect(() => {
    let result = [...issues];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(issue => 
        issue.title.toLowerCase().includes(term) || 
        issue.key.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(issue => issue.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== "all") {
      result = result.filter(issue => issue.priority === priorityFilter);
    }
    
    // Apply assignee filter
    if (assigneeFilter !== "all") {
      result = result.filter(issue => issue.assignee.name === assigneeFilter);
    }
    
    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter(issue => issue.type === typeFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortField === "key") {
        return sortDirection === "asc" 
          ? a.key.localeCompare(b.key) 
          : b.key.localeCompare(a.key);
      } else if (sortField === "priority") {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return sortDirection === "asc" 
          ? priorityOrder[a.priority] - priorityOrder[b.priority] 
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortField === "status") {
        const statusOrder = { open: 0, 'in progress': 1, resolved: 2, closed: 3 };
        return sortDirection === "asc" 
          ? statusOrder[a.status] - statusOrder[b.status] 
          : statusOrder[b.status] - statusOrder[a.status];
      } else if (sortField === "updated") {
        return sortDirection === "asc" 
          ? new Date(a.updated) - new Date(b.updated) 
          : new Date(b.updated) - new Date(a.updated);
      } else if (sortField === "dueDate") {
        return sortDirection === "asc" 
          ? new Date(a.dueDate) - new Date(b.dueDate) 
          : new Date(b.dueDate) - new Date(a.dueDate);
      }
      return 0;
    });
    
    setFilteredIssues(result);
  }, [issues, searchTerm, statusFilter, priorityFilter, assigneeFilter, typeFilter, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const priorityBadge = (priority) => {
    const variants = {
      critical: 'danger',
      high: 'warning',
      medium: 'info',
      low: 'success'
    };
    return <Badge variant={variants[priority]}>{priority}</Badge>;
  };

  const statusBadge = (status) => {
    const variants = {
      open: 'primary',
      'in progress': 'info',
      resolved: 'success',
      closed: 'default'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const typeBadge = (type) => {
    const variants = {
      bug: 'danger',
      task: 'primary',
      story: 'success',
      epic: 'info'
    };
    return <Badge variant={variants[type]}>{type}</Badge>;
  };

  // Get unique values for filters
  const assignees = [...new Set(issues.map(issue => issue.assignee.name))];
  const statuses = [...new Set(issues.map(issue => issue.status))];
  const priorities = [...new Set(issues.map(issue => issue.priority))];
  const types = [...new Set(issues.map(issue => issue.type))];

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
                as={Link}
                to="/issues/new"
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
              placeholder="Search issues by title or key..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-lg"
            />
            
            <div className="flex space-x-3">
              <Button
                variant={showFilters ? "primary" : "secondary"}
                onClick={() => setShowFilters(!showFilters)}
                icon={SlidersHorizontal}
              >
                Filters
                {(statusFilter !== "all" || priorityFilter !== "all" || assigneeFilter !== "all" || typeFilter !== "all") && (
                  <span className="ml-2 bg-[#01a370] text-white text-xs px-2 py-0.5 rounded-full">
                    {[statusFilter, priorityFilter, assigneeFilter, typeFilter].filter(f => f !== "all").length}
                  </span>
                )}
              </Button>
              
              <Button variant="secondary" icon={Filter}>
                Sort
              </Button>
            </div>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Statuses" },
                  ...statuses.map(status => ({
                    value: status,
                    label: status.charAt(0).toUpperCase() + status.slice(1)
                  }))
                ]}
              />
              
              <Select
                label="Priority"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Priorities" },
                  ...priorities.map(priority => ({
                    value: priority,
                    label: priority.charAt(0).toUpperCase() + priority.slice(1)
                  }))
                ]}
              />
              
              <Select
                label="Assignee"
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Assignees" },
                  ...assignees.map(assignee => ({
                    value: assignee,
                    label: assignee
                  }))
                ]}
              />
              
              <Select
                label="Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Types" },
                  ...types.map(type => ({
                    value: type,
                    label: type.charAt(0).toUpperCase() + type.slice(1)
                  }))
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-32"
                    onClick={() => handleSort("key")}
                  >
                    <div className="flex items-center">
                      Key
                      {sortField === "key" && (
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
                    onClick={() => handleSort("type")}
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
                      key={issue.id} 
                      className="hover:bg-gray-50 cursor-pointer" 
                      // onClick={() => navigate(`/issues/${issue.id}`)}
                         onClick={() => navigate(`/issues/details`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#01a370]">{issue.key}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-md">{issue.title}</div>
                        <div className="text-xs text-gray-500">
                          Updated {new Date(issue.updated).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {typeBadge(issue.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {priorityBadge(issue.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {statusBadge(issue.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <UserAvatar user={issue.assignee} size="small" />
                          <div className="ml-2 text-sm font-medium text-gray-900 truncate max-w-xs">{issue.assignee.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <UserAvatar user={issue.reporter} size="small" />
                          <div className="ml-2 text-sm text-gray-900 truncate max-w-xs">{issue.reporter.name}</div>
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
                            as={Link}
                            to="/issues/new"
                            variant="primary"
                            icon={Plus}
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
          {filteredIssues.length > 0 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{' '}
                    <span className="font-medium">{filteredIssues.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <a
                      href="#"
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronUp className="h-5 w-5 transform -rotate-90" />
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      1
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      2
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronUp className="h-5 w-5 transform rotate-90" />
                    </a>
                  </nav>
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