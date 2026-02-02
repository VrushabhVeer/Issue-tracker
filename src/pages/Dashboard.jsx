import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Filter,
  Plus,
  Search,
  Users,
  AlertCircle,
  TrendingUp,
  FolderOpen
} from "lucide-react";

// Import reusable components
import Button from '../common/Button';
import Card from '../common/Card';
import Badge from '../common/Badge';
import UserAvatar from '../common/UserAvatar';
import { DashboardApis } from "../api";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    openIssues: 0,
    resolvedIssues: 0,
    teamMembers: 0
  });

  const navigate = useNavigate();

  const [recentIssues, setRecentIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await DashboardApis.getDashboardStats();
        if (response.success) {
          setStats(response.data.stats);
          setRecentIssues(response.data.recentIssues);
          setProjects(response.data.projects);
          setActivities(response.data.activities);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Could not load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01a370]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }


  const priorityBadge = (priority) => {
    const variants = {
      high: 'danger',
      medium: 'warning',
      low: 'success'
    };
    return <Badge variant={variants[priority]}>{priority}</Badge>;
  };

  const statusBadge = (status) => {
    const variants = {
      open: 'primary',
      'in progress': 'info',
      resolved: 'success'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const StatCard = ({ icon: Icon, label, value, iconColor = 'text-gray-400' }) => (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </Card>
  );

  const QuickActionButton = ({ icon: Icon, label, to }) => (
    <Link
      to={to}
      className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-[#01a370] hover:bg-gray-50 transition-colors"
    >
      <Icon className="h-6 w-6 text-[#01a370] mb-2" />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Dashboard
              </h1>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button variant="primary" icon={Plus} onClick={() => navigate("/issues/new")}>
                New Issue
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            icon={FolderOpen}
            label="Total Projects"
            value={stats.totalProjects}
          />
          <StatCard
            icon={AlertCircle}
            label="Open Issues"
            value={stats.openIssues}
            iconColor="text-red-400"
          />
          <StatCard
            icon={CheckCircle}
            label="Resolved Issues"
            value={stats.resolvedIssues}
            iconColor="text-green-400"
          />
          <StatCard
            icon={Users}
            label="Team Members"
            value={stats.teamMembers}
            iconColor="text-blue-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Issues */}
          <div className="lg:col-span-2">
            <Card
              title="Recent Issues"
              actions={
                <Button variant="secondary" size="small" icon={Filter}>
                  Filter
                </Button>
              }
            >
              <ul className="divide-y divide-gray-200">
                {recentIssues.map((issue) => (
                  <li key={issue.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          <Link to={`/issues/${issue.id}`} className="hover:text-[#01a370]">
                            {issue.title}
                          </Link>
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {issue.project} • Assigned to {issue.assignee}
                        </p>
                      </div>
                      <div className="ml-4 flex flex-col items-end">
                        <div className="flex space-x-2 mb-2">
                          {priorityBadge(issue.priority)}
                          {statusBadge(issue.status)}
                        </div>
                        <p className="text-xs text-gray-500">{issue.date}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-6 py-4 bg-gray-50 text-sm text-center">
                <Link to="/issues" className="font-medium text-[#01a370] hover:text-[#018a60]">
                  View all issues
                </Link>
              </div>
            </Card>

            {/* Project Progress */}
            <Card title="Project Progress" className="mt-8">
              <div className="px-6 py-4">
                {projects.map((project) => (
                  <div key={project.id} className="mb-6 last:mb-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{project.name}</span>
                      <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-[#01a370] h-2.5 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">{project.completed}/{project.issues} tasks completed</span>
                      <span className="text-xs text-gray-500">{project.issues - project.completed} remaining</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <Card title="Recent Activity">
              <ul className="divide-y divide-gray-200">
                {activities.map((activity) => (
                  <li key={activity.id} className="px-6 py-4">
                    <div className="flex space-x-3">
                      <UserAvatar
                        user={{ name: activity.user }}
                        size="medium"
                        showName={false}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                        <p className="text-sm text-gray-500">
                          {activity.action} <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Quick Actions */}
            <Card title="Quick Actions">
              <div className="grid grid-cols-2 gap-4">
                <QuickActionButton
                  icon={Plus}
                  label="New Issue"
                  to="/issues/new"
                />
                <QuickActionButton
                  icon={FolderOpen}
                  label="New Project"
                  to="/projects/new"
                />
                <QuickActionButton
                  icon={BarChart3}
                  label="Reports"
                  to="/reports"
                />
                <QuickActionButton
                  icon={Users}
                  label="Team"
                  to="/team"
                />
              </div>
            </Card>

            {/* Upcoming Deadlines */}
            <Card
              title="Upcoming Deadlines"
              actions={<Calendar className="h-5 w-5 text-gray-400" />}
            >
              <ul className="divide-y divide-gray-200">
                <li className="px-6 py-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Mobile App Beta</p>
                      <p className="text-xs text-gray-500">Website Redesign project</p>
                    </div>
                    <Badge variant="danger">Tomorrow</Badge>
                  </div>
                </li>
                <li className="px-6 py-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">API Documentation</p>
                      <p className="text-xs text-gray-500">Backend Services project</p>
                    </div>
                    <Badge variant="warning">In 3 days</Badge>
                  </div>
                </li>
                <li className="px-6 py-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">User Testing</p>
                      <p className="text-xs text-gray-500">Analytics Module project</p>
                    </div>
                    <Badge variant="default">Next week</Badge>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;