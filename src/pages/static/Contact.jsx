import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Input from '../../common/Input';
import TextArea from '../../common/TextArea';
import Button from '../../common/Button';

const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Dummy submit
        alert("Message sent! We'll get back to you soon.");
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Contact <span className="text-[#01a370]">Us</span></h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Have questions or need support? Our team is here to help you get the most out of IssueTracker.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <div>
                        <div className="grid grid-cols-1 gap-8 mb-12">
                            <div className="flex items-start">
                                <div className="bg-green-50 p-4 rounded-xl text-[#01a370] mr-6">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Email us</h3>
                                    <p className="text-gray-600">Our friendly team is here to help.</p>
                                    <p className="text-[#01a370] font-medium mt-1">support@issuetracker.com</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-green-50 p-4 rounded-xl text-[#01a370] mr-6">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Call us</h3>
                                    <p className="text-gray-600">Mon-Fri from 8am to 5pm.</p>
                                    <p className="text-[#01a370] font-medium mt-1">+1 (555) 000-0000</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-green-50 p-4 rounded-xl text-[#01a370] mr-6">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Office</h3>
                                    <p className="text-gray-600">Come say hello at our headquarters.</p>
                                    <p className="text-gray-900 font-medium mt-1">100 Innovation Way, San Francisco, CA 94105</p>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-gray-100 rounded-3xl h-64 w-full flex items-center justify-center text-gray-400">
                            <span className="text-sm font-medium">Interactive Map Integration</span>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Send us a message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="First Name" placeholder="Jane" required />
                                <Input label="Last Name" placeholder="Doe" required />
                            </div>
                            <Input label="Email" type="email" placeholder="jane@example.com" required />
                            <Input label="Subject" placeholder="How can we help?" required />
                            <TextArea label="Message" rows={5} placeholder="Tell us more about your needs..." required />
                            <Button variant="primary" className="w-full py-4 text-lg" icon={Send}>
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
