import React, { useState } from 'react';
import type { User } from '../types';
import { UserIcon, AtSymbolIcon, PhoneIcon, GlobeIcon, CalendarIcon, IdentificationIcon, LockClosedIcon, CloseIcon, ClockIcon } from './icons';
import { BackButton } from './BackButton';
import { useI18n } from './I18n';

const USERS_KEY = 'geosick_users';

interface ProfilePageProps {
  user: User;
  onBack: () => void;
  onUpdateUser: (updatedDetails: Partial<User>) => boolean;
}

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not provided';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (e) {
        return dateString;
    }
};

const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not provided';
    try {
        return new Date(dateString).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    } catch (e) {
        return dateString;
    }
};

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onBack, onUpdateUser }) => {
    const { t } = useI18n();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({
        name: user.name,
        email: user.email,
        place: user.place,
        gender: user.gender,
    });
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const handleEditToggle = () => {
        if (isEditing) {
            setFormData({
                name: user.name,
                email: user.email,
                place: user.place,
                gender: user.gender,
            });
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const success = onUpdateUser(formData);
        if (success) {
            setIsEditing(false);
        } else {
            alert("Failed to save profile. Please try again.");
        }
    };

    return (
        <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center animate-fade-in bg-slate-50">
            <main className="w-full max-w-3xl mx-auto z-10">
                <header className="mb-8">
                    <div className="mb-6">
                        <BackButton onClick={onBack} />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                            <UserIcon className="w-10 h-10 text-slate-500"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">{t('my_profile')}</h1>
                            <p className="text-slate-600">Your personal and account information.</p>
                        </div>
                    </div>
                </header>

                <div className="space-y-8">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200/80">
                        <div className="p-6 border-b border-slate-200/80 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800">{t('personal_details')}</h2>
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <button onClick={handleEditToggle} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md transition-colors">{t('cancel')}</button>
                                    <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors">{t('save_changes')}</button>
                                </div>
                            ) : (
                                <button onClick={handleEditToggle} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">{t('edit_profile')}</button>
                            )}
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            <InfoField icon={<UserIcon className="w-5 h-5"/>} label={t('full_name')} name="name" value={formData.name} isEditing={isEditing} onChange={handleInputChange} />
                            <InfoField icon={<AtSymbolIcon className="w-5 h-5"/>} label={t('email_address')} name="email" value={formData.email} isEditing={isEditing} onChange={handleInputChange} type="email" />
                            <InfoField icon={<PhoneIcon className="w-5 h-5"/>} label={t('phone_number')} value={user.phone} isEditing={false} />
                            <InfoField icon={<CalendarIcon className="w-5 h-5"/>} label={t('dob')} value={formatDate(user.date_of_birth)} isEditing={false} />
                            <InfoField icon={<GlobeIcon className="w-5 h-5"/>} label={t('place')} name="place" value={formData.place} isEditing={isEditing} onChange={handleInputChange} />
                            <InfoField as="select" icon={<IdentificationIcon className="w-5 h-5"/>} label={t('gender')} name="gender" value={formData.gender} isEditing={isEditing} onChange={handleInputChange}>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </InfoField>
                        </div>
                    </div>
                </div>
            </main>
            {isPasswordModalOpen && <ChangePasswordModal user={user} onClose={() => setIsPasswordModalOpen(false)} />}
        </div>
    );
};

const InfoField: React.FC<any> = ({ icon, label, name, value, isEditing, onChange, type = 'text', as = 'input', children }) => {
    const commonInputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500";
    
    return (
        <div className="flex items-start gap-4 py-2">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-500 mt-1">{icon}</div>
            <div className="flex-grow">
                <label className="text-sm font-medium text-slate-500">{label}</label>
                {isEditing ? (
                    as === 'select' ? (
                        <select name={name} value={value || ''} onChange={onChange} className={commonInputClasses}>
                            {children}
                        </select>
                    ) : (
                        <input type={type} name={name} value={value || ''} onChange={onChange} className={commonInputClasses} />
                    )
                ) : (
                    <p className="text-base font-semibold text-slate-800 break-words">{value || 'Not provided'}</p>
                )}
            </div>
        </div>
    );
};

const ChangePasswordModal: React.FC<{ user: User, onClose: () => void }> = ({ user, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
             setError("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            try {
                const allUsers: any[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
                const userIndex = allUsers.findIndex(u => u.phone === user.phone);

                if (userIndex === -1 || allUsers[userIndex].password !== currentPassword) {
                    throw new Error("Your current password is not correct.");
                }

                allUsers[userIndex].password = newPassword;
                localStorage.setItem(USERS_KEY, JSON.stringify(allUsers));
                
                setSuccess("Password changed successfully!");
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(onClose, 1500);

            } catch (err: any) {
                setError(err.message || "An error occurred.");
            } finally {
                setIsLoading(false);
            }
        }, 500);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <header className="p-4 flex justify-between items-center border-b border-slate-200">
                     <h2 className="text-lg font-bold text-slate-800">Change Password</h2>
                     <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 flex-shrink-0">
                        <CloseIcon className="w-6 h-6 text-slate-600" />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                        <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {success && <p className="text-sm text-green-600">{success}</p>}
                    <button type="submit" disabled={isLoading} className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-md transition-all duration-300 disabled:bg-slate-400">
                        {isLoading ? 'Saving...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};