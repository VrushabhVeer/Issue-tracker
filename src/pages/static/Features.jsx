import React from 'react';
import Card from '../../common/Card';
import {
    BarChart3,
    Users,
    Zap,
    Shield,
    Clock,
    Layout,
    MessageSquare,
    Workflow
} from 'lucide-react';

const Features = () => {
    const features = [
        {
            title: "Real-time Collaboration",
            description: "Work together with your team seamlessly. See updates as they happen and stay in sync.",
            icon: Users,
            color: "text-blue-500",
            bgColor: "bg-blue-50"
        },
        {
            title: "Advanced Analytics",
            description: "Gain insights into your project's performance with beautiful, interactive charts and reports.",
            icon: BarChart3,
            color: "text-[#01a370]",
            bgColor: "bg-green-50"
        },
        {
            title: "Lightning Fast",
            description: "Our optimized architecture ensures everything loads instantly, keeping you in the flow.",
            icon: Zap,
            color: "text-amber-500",
            bgColor: "bg-amber-50"
        },
        {
            title: "Enterprise Security",
            description: "Your data is protected with industrial-grade encryption and granular access controls.",
            icon: Shield,
            color: "text-indigo-500",
            bgColor: "bg-indigo-50"
        },
        {
            title: "Time Tracking",
            description: "Monitor progress accurately with integrated time tracking and estimation tools.",
            icon: Clock,
            color: "text-rose-500",
            bgColor: "bg-rose-50"
        },
        {
            title: "Custom Workflows",
            description: "Adapt the system to your unique process with flexible and customizable status flows.",
            icon: Workflow,
            color: "text-purple-500",
            bgColor: "bg-purple-50"
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Powerful tools for <span className="text-[#01a370]">Modern Teams</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        IssueTracker comes packed with everything you need to manage complex projects,
                        track bugs, and deliver software faster.
                    </p>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {features.map((feature, index) => (
                        <div key={index} className="group p-8 rounded-2xl border border-gray-100 hover:border-[#01a370]/30 hover:shadow-xl transition-all duration-300 bg-white">
                            <div className={`${feature.bgColor} ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="bg-[#01a370] rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">
                        Ready to streamline your workflow?
                    </h2>
                    <p className="text-green-50 text-xl mb-10 max-w-2xl mx-auto relative z-10">
                        Join thousands of teams already using IssueTracker to build better products.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                        <button className="bg-white text-[#01a370] px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
                            Start Free Trial
                        </button>
                        <button className="bg-black/20 text-white border border-white/30 px-8 py-4 rounded-xl font-bold hover:bg-black/30 transition-colors backdrop-blur-sm">
                            Schedule Demo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;
