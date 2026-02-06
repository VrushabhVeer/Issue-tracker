import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ListTodo,
    Plus,
    ChevronDown,
    ChevronRight,
    MoreHorizontal,
    Play,
    CheckCircle2,
    Calendar,
    AlertCircle,
    Archive
} from "lucide-react";
import { toast } from "react-toastify";
import { IssueApis, SprintApis } from "../../api";

// Reusable components
import Button from '../../common/Button';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import LoadingSpinner from '../../common/LoadingSpinner';
import UserAvatar from '../../common/UserAvatar';

const Backlog = () => {
    const { id: projectId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [backlogData, setBacklogData] = useState({
        planned_sprints: [],
        backlog_issues: [],
        sprint_issues: []
    });
    const [showCreateSprint, setShowCreateSprint] = useState(false);
    const [newSprint, setNewSprint] = useState({
        name: "",
        start_date: "",
        end_date: ""
    });

    const fetchBacklog = async () => {
        try {
            setLoading(true);
            const response = await IssueApis.getBacklog(projectId);
            if (response.success) {
                setBacklogData(response.data);
            }
        } catch (error) {
            console.error("Fetch backlog error:", error);
            toast.error("Failed to load backlog");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBacklog();
    }, [projectId]);

    const handleCreateSprint = async () => {
        if (!newSprint.name.trim()) return;
        try {
            const response = await SprintApis.createSprint({
                project_id: projectId,
                name: newSprint.name,
                start_date: newSprint.start_date || undefined,
                end_date: newSprint.end_date || undefined
            });
            if (response.success) {
                toast.success("Sprint created");
                setNewSprint({ name: "", start_date: "", end_date: "" });
                setShowCreateSprint(false);
                fetchBacklog();
            }
        } catch (error) {
            toast.error("Failed to create sprint");
        }
    };

    const handleStartSprint = async (sprintId) => {
        try {
            const response = await SprintApis.startSprint(sprintId, {});
            if (response.success) {
                toast.success("Sprint started!");
                navigate(`/projects/${projectId}/board`);
            }
        } catch (error) {
            toast.error(error.message?.error_message || "Failed to start sprint");
        }
    };

    const handleMoveToSprint = async (issueId, sprintId) => {
        try {
            const response = await IssueApis.updateIssue(issueId, { sprint_id: sprintId === "backlog" ? null : sprintId });
            if (response.success) {
                toast.success(sprintId === "backlog" ? "Moved to backlog" : "Added to sprint");
                fetchBacklog();
            }
        } catch (error) {
            toast.error("Failed to move issue");
        }
    };

    const IssueItem = ({ issue, currentSprintId = null }) => (
        <div
            className="flex items-center justify-between p-2 hover:bg-gray-50 border-b border-gray-100 last:border-0 group"
        >
            <div
                onClick={() => navigate(`/issues/details/${issue._id}`)}
                className="flex items-center space-x-3 truncate cursor-pointer flex-1"
            >
                <Badge variant={issue.issue_type === 'bug' ? 'danger' : 'primary'} className="scale-75">
                    {issue.issue_type}
                </Badge>
                <span className="text-xs font-bold text-gray-500 w-20 shrink-0">{issue.issue_key}</span>
                <span className="text-sm text-gray-700 truncate">{issue.title}</span>
            </div>
            <div className="flex items-center space-x-3 shrink-0">
                {/* Move to Sprint Selector */}
                <select
                    className="text-[10px] bg-gray-50 border border-gray-200 rounded px-1 py-0.5 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
                    value={currentSprintId || "backlog"}
                    onChange={(e) => handleMoveToSprint(issue._id, e.target.value)}
                >
                    <option value="backlog">Backlog</option>
                    {backlogData.planned_sprints.map(s => (
                        <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                </select>

                <Badge variant="ghost" className="text-[10px] text-gray-400">
                    {issue.status.replace('_', ' ')}
                </Badge>
                <div className={`text-[10px] font-bold uppercase w-16 text-center ${issue.priority === 'high' || issue.priority === 'critical' ? 'text-red-500' : 'text-gray-400'
                    }`}>
                    {issue.priority}
                </div>
                <UserAvatar user={issue.assignee_id} size="small" />
            </div>
        </div>
    );

    const SprintSection = ({ sprint, issues }) => {
        const [isOpen, setIsOpen] = useState(true);

        return (
            <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-gray-600">
                            {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </button>
                        <h3 className="font-bold text-gray-900">{sprint.name}</h3>
                        <span className="text-xs text-gray-500 font-medium">({issues.length} issues)</span>
                        {sprint.status === 'active' && <Badge variant="success" className="text-[10px]">ACTIVE</Badge>}
                    </div>
                    <div className="flex items-center space-x-2">
                        {sprint.status === 'planned' && (
                            <Button
                                variant="primary"
                                size="small"
                                icon={Play}
                                onClick={() => handleStartSprint(sprint._id)}
                            >
                                Start Sprint
                            </Button>
                        )}
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                {isOpen && (
                    <div className="bg-white">
                        {issues.length > 0 ? (
                            issues.map(issue => <IssueItem key={issue._id} issue={issue} currentSprintId={sprint._id} />)
                        ) : (
                            <div className="py-8 text-center text-sm text-gray-400 italic">
                                No issues in this sprint. Drag issues here or use 'Create' to add some.
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header */}
            <div className="border-b border-gray-200 bg-gray-50/50 px-8 py-6">
                <div className="max-w-screen-xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-600 p-2 rounded-lg text-white">
                            <ListTodo className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Backlog</h1>
                            <p className="text-sm text-gray-500 mt-1">Plan and prioritize your project sprints</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            variant="secondary"
                            icon={Plus}
                            onClick={() => setShowCreateSprint(true)}
                        >
                            Create Sprint
                        </Button>
                        <Button variant="primary" icon={Plus} onClick={() => navigate('/issues/new')}>
                            Create Issue
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-8 py-8">
                {/* Planned Sprints */}
                {backlogData.planned_sprints.map(sprint => (
                    <SprintSection
                        key={sprint._id}
                        sprint={sprint}
                        issues={backlogData.sprint_issues.filter(i => i.sprint_id === sprint._id)}
                    />
                ))}

                {/* Create Sprint Form */}
                {showCreateSprint && (
                    <div className="mb-6 p-6 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/30">
                        <h3 className="text-sm font-bold text-blue-700 mb-4 uppercase tracking-wider">New Sprint</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="md:col-span-1">
                                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Sprint Name</label>
                                <input
                                    autoFocus
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Sprint-Feb"
                                    value={newSprint.name}
                                    onChange={(e) => setNewSprint({ ...newSprint, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Start Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
                                    value={newSprint.start_date}
                                    onChange={(e) => setNewSprint({ ...newSprint, start_date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">End Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
                                    value={newSprint.end_date}
                                    onChange={(e) => setNewSprint({ ...newSprint, end_date: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 justify-end">
                            <Button variant="ghost" size="small" onClick={() => setShowCreateSprint(false)}>Cancel</Button>
                            <Button variant="primary" size="small" onClick={handleCreateSprint}>Create Sprint</Button>
                        </div>
                    </div>
                )}

                {/* Backlog Section */}
                <div className="mt-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center">
                            Backlog
                            <span className="ml-2 text-sm text-gray-400">({backlogData.backlog_issues.length} issues)</span>
                        </h2>
                    </div>
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        {backlogData.backlog_issues.length > 0 ? (
                            backlogData.backlog_issues.map(issue => <IssueItem key={issue._id} issue={issue} />)
                        ) : (
                            <div className="py-12 bg-gray-50 text-center">
                                <Archive className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">Your backlog is empty!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Backlog;
