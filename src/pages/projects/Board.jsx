import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Trello,
    Layout,
    Plus,
    MoreVertical,
    Filter,
    Search,
    User,
    Clock,
    CheckCircle2,
    Circle,
    PlayCircle,
    HelpCircle,
    ChevronRight
} from "lucide-react";
import { toast } from "react-toastify";
import { IssueApis, SprintApis } from "../../api";

// Reusable components
import Button from '../../common/Button';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import LoadingSpinner from '../../common/LoadingSpinner';
import UserAvatar from '../../common/UserAvatar';
import EmptyState from '../../common/EmptyState';

const Board = () => {
    const { id: projectId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [boardData, setBoardData] = useState({
        sprint: null,
        columns: { open: [], in_progress: [], resolved: [], closed: [] }
    });
    const [searchQuery, setSearchQuery] = useState("");

    const fetchBoardData = async () => {
        try {
            setLoading(true);
            const response = await IssueApis.getBoardData(projectId);
            if (response.success) {
                setBoardData(response.data);
            }
        } catch (error) {
            console.error("Fetch board data error:", error);
            toast.error(error.message?.error_message || "Failed to load board");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoardData();
    }, [projectId]);

    const handleUpdateStatus = async (issueId, newStatus) => {
        try {
            const response = await IssueApis.updateIssue(issueId, { status: newStatus });
            if (response.success) {
                fetchBoardData(); // Refresh board
                toast.success(`Issue updated to ${newStatus.replace('_', ' ')}`);
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'highest': case 'critical': return 'text-red-600';
            case 'high': return 'text-orange-600';
            case 'medium': return 'text-blue-600';
            case 'low': return 'text-green-600';
            case 'lowest': return 'text-gray-600';
            default: return 'text-gray-600';
        }
    };

    const IssueCard = ({ issue }) => (
        <div
            onClick={() => navigate(`/issues/details/${issue._id}`)}
            className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer mb-3 group"
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{issue.issue_key || 'ISSUE'}</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                </div>
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 line-clamp-2">{issue.title}</h4>
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Badge variant={issue.issue_type === 'bug' ? 'danger' : 'primary'} className="text-[10px] py-0 px-1.5 uppercase">
                        {issue.issue_type}
                    </Badge>
                    <span className={`text-[10px] font-bold uppercase ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                    </span>
                </div>
                <UserAvatar user={issue.assignee_id} size="small" />
            </div>
        </div>
    );

    const Column = ({ title, status, issues, colorClass }) => {
        const filteredIssues = issues.filter(i =>
            i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (i.issue_key && i.issue_key.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        return (
            <div className="flex flex-col h-full min-w-[300px] w-full bg-gray-100 rounded-xl p-3 border border-gray-200/50">
                <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center space-x-2">
                        <h3 className={`text-sm font-bold uppercase tracking-widest ${colorClass}`}>
                            {title}
                        </h3>
                        <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            {filteredIssues.length}
                        </span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                        <Plus className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto min-h-[500px]">
                    {filteredIssues.map(issue => (
                        <IssueCard key={issue._id} issue={issue} />
                    ))}

                    {filteredIssues.length === 0 && (
                        <div className="h-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400 italic">
                            Empty
                        </div>
                    )}
                </div>
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
        <div className="min-h-screen bg-white">
            {/* Sub-header */}
            <div className="border-b border-gray-200 bg-gray-50/50 px-8 py-4">
                <div className="max-w-screen-2xl mx-auto">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                        <span className="hover:text-gray-900 cursor-pointer" onClick={() => navigate('/projects')}>Projects</span>
                        <ChevronRight className="h-3 w-3" />
                        <span className="font-medium text-gray-900">Sprint Board</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="bg-[#01a370] p-2 rounded-lg text-white">
                                <Trello className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {boardData.sprint ? boardData.sprint.name : 'No Active Sprint'}
                                </h1>
                                <div className="flex items-center space-x-3 mt-1">
                                    {boardData.sprint && (
                                        <>
                                            <Badge variant="success" className="text-[10px]">ACTIVE</Badge>
                                            <span className="text-xs text-gray-500 font-medium flex items-center">
                                                <Clock className="h-3 w-3 mr-1" />
                                                Ends {new Date(boardData.sprint.end_date).toLocaleDateString()}
                                            </span>
                                        </>
                                    )}
                                    {!boardData.sprint && (
                                        <span className="text-xs text-gray-500 italic">Go to backlog to start a sprint</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search board..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-[#01a370] focus:border-[#01a370] w-64"
                                />
                            </div>
                            <Button variant="secondary" icon={Filter} className="hidden lg:flex">Filters</Button>
                            <Button
                                variant="primary"
                                icon={Plus}
                                onClick={() => navigate('/issues/new')}
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Board Content */}
            <div className="px-8 py-6 h-[calc(100vh-180px)] overflow-x-auto">
                {!boardData.sprint ? (
                    <EmptyState
                        icon={Layout}
                        title="No Active Sprint"
                        description="Start a sprint in the backlog to see tasks on the board."
                        action={
                            <Button
                                variant="primary"
                                onClick={() => navigate(`/projects/${projectId}/backlog`)}
                            >
                                Go to Backlog
                            </Button>
                        }
                    />
                ) : (
                    <div className="flex space-x-6 min-h-full">
                        <Column
                            title="To Do"
                            status="open"
                            issues={boardData.columns.open}
                            colorClass="text-gray-600"
                        />
                        <Column
                            title="In Progress"
                            status="in_progress"
                            issues={boardData.columns.in_progress}
                            colorClass="text-blue-600"
                        />
                        <Column
                            title="Resolved"
                            status="resolved"
                            issues={boardData.columns.resolved}
                            colorClass="text-[#01a370]"
                        />
                        <Column
                            title="Done"
                            status="closed"
                            issues={boardData.columns.closed}
                            colorClass="text-purple-600"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Board;
