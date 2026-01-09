
import React, { useState, useEffect } from 'react';
import type { User, ActivityLogItem } from '../types';
import { LockClosedIcon, ListBulletIcon, ScanIcon, ClipboardListIcon, BrainCircuitIcon, StethoscopeIcon, UserGroupIcon, DocumentChartBarIcon } from './icons';
import { BackButton } from './BackButton';

const USERS_KEY = 'geosick_users';
const GLOBAL_ACTIVITY_HISTORY_KEY = 'geosick_global_activity_history';

const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
    } catch {
        return dateString;
    }
};

const ActivityIcon: React.FC<{ type: ActivityLogItem['type'] }> = ({ type }) => {
    switch (type) {
        case 'image-analysis': return <ScanIcon className="w-5 h-5 text-blue-500" />;
        case 'prescription-analysis': return <ClipboardListIcon className="w-5 h-5 text-green-500" />;
        case 'mental-health': return <BrainCircuitIcon className="w-5 h-5 text-indigo-500" />;
        case 'symptom-checker': return <StethoscopeIcon className="w-5 h-5 text-teal-500" />;
        case 'login': return <LockClosedIcon className="w-5 h-5 text-slate-500" />;
        default: return <ListBulletIcon className="w-5 h-5 text-slate-500" />;
    }
};

interface AdminDashboardPageProps {
  onBack: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onBack }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [activities, setActivities] = useState<ActivityLogItem[]>([]);

    useEffect(() => {
        try {
            const storedUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
            const storedActivities = JSON.parse(localStorage.getItem(GLOBAL_ACTIVITY_HISTORY_KEY) || '[]');
            setUsers(storedUsers);
            setActivities(storedActivities);
        } catch (e) {
            console.error("Failed to load admin data from localStorage", e);
        }
    }, []);

    const nonAdminUsers = users.filter(u => !u.isAdmin);

    return (
        <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center animate-fade-in bg-slate-100">
            <header className="w-full max-w-6xl mx-auto mb-8">
                <div className="mb-6">
                    <BackButton onClick={onBack} />
                </div>
                <div className="flex items-center gap-3">
                    <LockClosedIcon className="w-10 h-10 text-slate-600" />
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
                            Admin Dashboard
                        </h1>
                        <p className="text-slate-600">Global Application Activity & User Management</p>
                    </div>
                </div>
            </header>

            <main className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    {/* User Management Table */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200/80">
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                           <UserGroupIcon className="w-6 h-6 text-slate-500" />
                           User Management ({nonAdminUsers.length})
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Login</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {nonAdminUsers.map(user => (
                                        <tr key={user.phone}>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-slate-900">{user.name}</div>
                                                <div className="text-sm text-slate-500">{user.email || user.phone}</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{formatDateTime(user.created_at)}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{formatDateTime(user.last_login_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200/80">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                       <ListBulletIcon className="w-6 h-6 text-slate-500" />
                       Global Activity
                    </h2>
                    <div className="max-h-[65vh] overflow-y-auto pr-2">
                        {activities.length > 0 ? (
                             <div className="space-y-3">
                                {activities.map(item => (
                                     <div key={item.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-md border border-slate-200/80">
                                         <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center mt-1 border">
                                            <ActivityIcon type={item.type} />
                                         </div>
                                         <div className="flex-grow min-w-0">
                                            <p className="font-semibold text-sm text-slate-800 truncate">{item.title}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">by <span className="font-medium">{item.userPhone}</span></p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {new Date(item.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                                            </p>
                                         </div>
                                     </div>
                                ))}
                             </div>
                        ) : (
                            <p className="text-center text-slate-500 py-8">No user activity recorded yet.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
