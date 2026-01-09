import React, { useState } from 'react';
import { MailIcon, SendIcon, BriefcaseIcon, MegaphoneIcon, ChevronDownIcon, QuestionMarkCircleIcon, CheckCircleIcon } from './icons';
import { ContactWaveBackground } from './ContactWaveBackground';
import { BackButton } from './BackButton';

interface ContactPageProps {
  onBack: () => void;
}

type FormStatus = 'idle' | 'sending' | 'sent';

const FloatingLabelInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => (
    <div className="relative z-0">
        <input 
            id={id}
            className="block py-2.5 px-0 w-full text-base text-slate-900 bg-transparent border-0 border-b-2 border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder=" " 
            {...props} 
        />
        <label 
            htmlFor={id} 
            className="absolute text-base text-slate-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
            {label}
        </label>
    </div>
);

const FloatingLabelTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, id, ...props }) => (
    <div className="relative z-0">
        <textarea 
            id={id}
            rows={4}
            className="block py-2.5 px-0 w-full text-base text-slate-900 bg-transparent border-0 border-b-2 border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder=" "
            {...props} 
        />
        <label 
            htmlFor={id} 
            className="absolute text-base text-slate-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
            {label}
        </label>
    </div>
);

const AccordionItem: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-4 text-left font-semibold text-slate-800 hover:bg-slate-50/50"
                aria-expanded={isOpen}
            >
                <span className="flex-1 pr-2">{title}</span>
                <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="pb-4 text-slate-600 text-sm">
                         {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContactCard = ({ icon, title, email }: { icon: React.ReactNode, title: string, email: string }) => (
    <div className="flex items-start gap-4 bg-white/60 backdrop-blur-xl rounded-lg p-4 shadow-lg border border-slate-200/50">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-500 rounded-lg flex items-center justify-center">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            <a href={`mailto:${email}`} className="text-blue-600 font-medium hover:underline">{email}</a>
        </div>
    </div>
);

export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'idle') return;
    
    setStatus('sending');
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', { name, email, message });
      setStatus('sent');
    }, 1500);
  };
  
  const faqs = [
    { q: "Is GeoSick a replacement for a doctor?", a: "Absolutely not. GeoSick is an informational tool designed to provide insights into environmental health risks and potential conditions. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider with any health concerns." },
    { q: "How does the AI analysis work?", a: "Our platform uses Google's advanced Gemini AI models. We provide the AI with data (like geographic coordinates or an image) and a carefully crafted prompt. The AI then analyzes this information to identify patterns, hazards, and potential health correlations based on its vast training data." },
    { q: "Is my data private and secure?", a: "For this demonstration version, all user data, including login information and activity history, is stored locally in your browser's localStorage. No personal data is sent to or stored on our servers, ensuring your privacy. A production version would use a secure, dedicated authentication service." },
    { q: "Who is GeoSick for?", a: "GeoSick is designed for everyone. Individuals can use it for personal health awareness, communities can monitor local environmental conditions, and public health organizations can leverage it for large-scale risk assessment and proactive planning." }
  ];

  return (
    <div className="relative w-full min-h-screen flex flex-col p-4 animate-fade-in overflow-hidden">
        <ContactWaveBackground />

        <div className="relative z-10 w-full flex flex-col items-center flex-grow">
            <header className="w-full max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-start items-center">
                <BackButton onClick={onBack} />
            </header>

            <main className="flex-grow w-full max-w-6xl mx-auto flex items-center justify-center py-12 px-4">
                <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
                    {/* Left Column: Info & FAQ */}
                    <div className="lg:col-span-2 space-y-8 animate-fade-in-up">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
                                Connect With Us
                            </h1>
                            <p className="mt-4 text-lg text-slate-700">
                                Have a question or proposal? Reach out and our team will get back to you.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <ContactCard icon={<MailIcon className="w-6 h-6" />} title="General Inquiries" email="support@geosick.com" />
                            <ContactCard icon={<BriefcaseIcon className="w-6 h-6" />} title="Partnerships" email="partners@geosick.com" />
                            <ContactCard icon={<MegaphoneIcon className="w-6 h-6" />} title="Media & Press" email="press@geosick.com" />
                        </div>

                        {/* FAQ Section */}
                        <div className="pt-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                                <QuestionMarkCircleIcon className="w-7 h-7" />
                                Frequently Asked Questions
                            </h2>
                            <div className="bg-white/60 backdrop-blur-xl rounded-lg shadow-lg p-4 border border-slate-200/50">
                                {faqs.map((faq, i) => (
                                    <AccordionItem key={i} title={faq.q}>{faq.a}</AccordionItem>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="lg:col-span-3 bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-12 animate-fade-in-up relative min-h-[500px]" style={{ animationDelay: '150ms' }}>
                        {status === 'sent' ? (
                            <div className="flex flex-col items-center justify-center text-center p-8 bg-transparent rounded-lg animate-fade-in h-full">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircleIcon className="w-10 h-10 text-green-500" />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-800">Message Sent!</h2>
                                <p className="mt-2 text-slate-600">
                                    Thank you for reaching out. We've received your message and will get back to you shortly.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <h2 className="text-3xl font-bold text-slate-800 mb-6">Send a Direct Message</h2>
                                <FloatingLabelInput 
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={status !== 'idle'}
                                    label="Full Name"
                                />
                                <FloatingLabelInput 
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={status !== 'idle'}
                                    label="Email Address"
                                />
                                 <FloatingLabelTextarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    disabled={status !== 'idle'}
                                    label="Your Message"
                                />
                                <button
                                  type="submit"
                                  disabled={status !== 'idle'}
                                  className="w-full mt-4 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                  <SendIcon className="w-5 h-5 mr-2" />
                                  {status === 'idle' ? 'Send Message' : 'Sending...'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    </div>
  );
};