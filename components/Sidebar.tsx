import React from 'react';
import type { User, Page } from '../types';
import { GlobeIcon, HomeIcon, HistoryIcon, UserIcon, LogoutIcon, CloseIcon, LockClosedIcon, ChatBubbleLeftEllipsisIcon } from './icons';
import { useI18n } from './I18n';
import { LanguageSelector } from './LanguageSelector';

interface SidebarProps {
  user: User;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenFeedbackModal: () => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            }`}
        >
            {icon}
            <span className="ml-3">{label}</span>
        </button>
    );
};


export const Sidebar: React.FC<SidebarProps> = ({ user, currentPage, onNavigate, onLogout, isOpen, onClose, onOpenFeedbackModal }) => {
    const { t } = useI18n();
    const navItems: { page: Page; label: string; icon: React.ReactNode, adminOnly?: boolean }[] = [
        { page: 'welcome', label: t('dashboard'), icon: <HomeIcon className="w-5 h-5" /> },
        { page: 'activity-history', label: t('activity_history'), icon: <HistoryIcon className="w-5 h-5" /> },
        { page: 'profile', label: t('my_profile'), icon: <UserIcon className="w-5 h-5" /> },
        { page: 'admin-dashboard', label: t('admin_dashboard'), icon: <LockClosedIcon className="w-5 h-5" />, adminOnly: true },
    ];

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 text-white flex flex-col h-screen p-4 
                transition-transform duration-300 ease-in-out 
                md:relative md:translate-x-0 md:flex-shrink-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                    <div className="flex items-center gap-2 px-2">
                        <GlobeIcon className="w-8 h-8 text-blue-400" />
                        <h1 className="text-xl font-bold tracking-tight">GeoSick</h1>
                    </div>
                    <button onClick={onClose} className="md:hidden p-1 text-slate-400 hover:text-white" aria-label="Close menu">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-grow mt-6 space-y-2">
                    {navItems.map(item => {
                        if (item.adminOnly && !user.isAdmin) {
                            return null;
                        }
                        return (
                            <NavItem
                                key={item.page}
                                icon={item.icon}
                                label={item.label}
                                isActive={currentPage === item.page}
                                onClick={() => onNavigate(item.page)}
                            />
                        );
                    })}
                     <button
                        onClick={onOpenFeedbackModal}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                    >
                        <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
                        <span className="ml-3">{t('feedback_review')}</span>
                    </button>
                </nav>
                
                <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="px-2 mb-3">
                        <label className="text-xs font-semibold text-slate-400">{t('language')}</label>
                        <LanguageSelector variant="dark" className="mt-1" />
                    </div>
                     <div className="flex items-center gap-3 p-2 rounded-lg">
                         <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">
                            {user.name.charAt(0).toUpperCase()}
                         </div>
                         <div className="flex-grow min-w-0">
                             <p className="font-semibold text-sm truncate">{user.name}</p>
                             <p className="text-xs text-slate-400 truncate">{user.email || user.phone}</p>
                         </div>
                     </div>
                     <button
                        onClick={onLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 text-slate-300 hover:bg-red-500/20 hover:text-red-300 mt-2"
                    >
                        <LogoutIcon className="w-5 h-5" />
                        <span className="ml-3">{t('logout')}</span>
                    </button>
                </div>
            </aside>
        </>
    );
};
