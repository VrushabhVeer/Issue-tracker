import React, { useState, useEffect } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
    FileText, Users, AlertTriangle, CheckCircle,
    TrendingUp, Layers, PieChart as PieChartIcon,
    Calendar, Loader2, Download
} from "lucide-react";
import { toast } from "react-toastify";

import Card from '../../common/Card';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import { ReportApis } from "../../api";

const COLORS = ['#01a370', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const Reports = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await ReportApis.getReportStats();
            if (response.success) {
                setData(response.data);
            }
        } catch (error) {
            console.error("Fetch reports error:", error);
            toast.error("Failed to load report data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 text-[#01a370] animate-spin mx-auto" />
                    <p className="mt-4 text-gray-600 font-medium">Gathering insights...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    // Process data for charts
    const statusData = data.statusStats.map(item => ({
        name: item._id.charAt(0).toUpperCase() + item._id.slice(1).replace('_', ' '),
        value: item.count
    }));

    const typeData = data.typeStats.map(item => ({
        name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
        count: item.count
    }));

    const priorityData = data.priorityStats.map(item => ({
        name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
        count: item.count
    }));

    // Combine created and resolved time series
    const allDates = [...new Set([
        ...data.timeSeries.created.map(d => d._id),
        ...data.timeSeries.resolved.map(d => d._id)
    ])].sort();

    const trendData = allDates.map(date => {
        const created = data.timeSeries.created.find(d => d._id === date)?.created || 0;
        const resolved = data.timeSeries.resolved.find(d => d._id === date)?.resolved || 0;
        return {
            date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            Created: created,
            Resolved: resolved
        };
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                <PieChartIcon className="mr-3 h-7 w-7 text-[#01a370]" />
                                Analytics & Reports
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Visualizing your team's performance and project progress
                            </p>
                        </div>
                        <Button variant="secondary" icon={Download} onClick={() => window.print()}>
                            Print Report
                        </Button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="flex flex-col items-center justify-center p-6 bg-white border-l-4 border-blue-500">
                        <Layers className="h-8 w-8 text-blue-500 mb-2" />
                        <span className="text-3xl font-bold text-gray-900">
                            {data.statusStats.reduce((acc, curr) => acc + curr.count, 0)}
                        </span>
                        <span className="text-gray-500 text-sm font-medium"> Total Issues</span>
                    </Card>

                    <Card className="flex flex-col items-center justify-center p-6 bg-white border-l-4 border-yellow-500">
                        <Calendar className="h-8 w-8 text-yellow-500 mb-2" />
                        <span className="text-3xl font-bold text-gray-900">
                            {data.statusStats.find(s => s._id === 'open')?.count || 0}
                        </span>
                        <span className="text-gray-500 text-sm font-medium"> Open Issues</span>
                    </Card>

                    <Card className="flex flex-col items-center justify-center p-6 bg-white border-l-4 border-[#01a370]">
                        <CheckCircle className="h-8 w-8 text-[#01a370] mb-2" />
                        <span className="text-3xl font-bold text-gray-900">
                            {data.statusStats.find(s => ['resolved', 'closed'].includes(s._id))?.count || 0}
                        </span>
                        <span className="text-gray-500 text-sm font-medium"> Resolved</span>
                    </Card>

                    <Card className="flex flex-col items-center justify-center p-6 bg-white border-l-4 border-red-500">
                        <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
                        <span className="text-3xl font-bold text-gray-900">
                            {data.priorityStats.find(p => ['critical', 'high'].includes(p._id))?.count || 0}
                        </span>
                        <span className="text-gray-500 text-sm font-medium"> High Priority</span>
                    </Card>
                </div>

                {/* Primary Row: Trends and Team */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Issue Trends */}
                    <Card
                        title="Issue Trends (Last 30 Days)"
                        className="lg:col-span-2 overflow-hidden"
                        subtitle="Creation vs. Resolution velocity"
                    >
                        <div className="h-[350px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#01a370" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#01a370" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="top" height={36} />
                                    <Area type="monotone" dataKey="Created" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCreated)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="Resolved" stroke="#01a370" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Team Workload */}
                    <Card title="Team Workload" subtitle="Issue distribution per member">
                        <div className="h-[350px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.teamStats} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke="#f0f0f0" />
                                    <XAxis type="number" axisLine={false} tickLine={false} hide />
                                    <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="count" fill="#01a370" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Secondary Row: Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Status Breakdown */}
                    <Card title="Status Distribution">
                        <div className="h-[300px] w-full mt-4 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center -mt-4">
                                <span className="block text-2xl font-bold text-gray-800">
                                    {statusData.reduce((a, b) => a + b.value, 0)}
                                </span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Total</span>
                            </div>
                        </div>
                    </Card>

                    {/* Type Breakdown */}
                    <Card title="Issue Types">
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={typeData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                    <YAxis hide />
                                    <Tooltip cursor={{ fill: '#f9fafb' }} />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={30}>
                                        {typeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Priority Breakdown */}
                    <Card title="Priority Levels">
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={priorityData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                    <YAxis hide />
                                    <Tooltip cursor={{ fill: '#f9fafb' }} />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={30}>
                                        {priorityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#ef4444', '#f59e0b', '#3b82f6', '#01a370', '#6366f1', '#a855f7'][index % 6]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default Reports;
