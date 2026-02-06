import React from 'react';
import { useLocation } from 'react-router-dom';

const StaticContent = () => {
    const location = useLocation();
    const path = location.pathname.substring(1);
    const title = path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <div className="bg-white min-h-screen py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-6 tracking-tight">
                    {title}
                </h1>

                <div className="prose prose-lg prose-green max-w-none text-gray-600 space-y-8 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                        <p>
                            Welcome to the {title} page for IssueTracker. Here you will find comprehensive information
                            regarding this topic. Our goal is to provide transparency and helpful resources for our users.
                        </p>
                    </section>

                    <section className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Detailed Information</h2>
                        <p className="mb-4">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
                            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <p>
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                            deserunt mollit anim id est laborum.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight text-[#01a370]">Key Highlights</h3>
                        <ul className="list-disc pl-6 space-y-3">
                            <li>Comprehensive resource management and tracking.</li>
                            <li>Collaborative tools designed for scale and efficiency.</li>
                            <li>Secure data handling with enterprise-grade standards.</li>
                            <li>Seamless integration with your favorite development tools.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <div className="border-l-4 border-[#01a370] pl-6 py-2">
                                <h4 className="font-bold text-gray-900 mb-2">How often is the {title} updated?</h4>
                                <p className="text-sm">
                                    We review and update our {title} on a regular basis to ensure it reflects the latest
                                    evolutions in our platform and services.
                                </p>
                            </div>
                            <div className="border-l-4 border-[#01a370] pl-6 py-2">
                                <h4 className="font-bold text-gray-900 mb-2">Can I provide feedback on this content?</h4>
                                <p className="text-sm">
                                    Absolutely. We value user input. Please head over to our contact page or community forum
                                    to share your thoughts.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default StaticContent;
