import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import BackButton from '@/components/BackButton/BackButton';
export default function Dashboard() {
    const { participants, addParticipant, removeParticipant, setActiveChat, setChatMeta, setActiveParticipants, resetApp, clearUser, deleteAccount } = useChatStore();
    const userId = useChatStore(state => state.userId);
    const userName = useChatStore(state => state.userName);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editPhoto, setEditPhoto] = useState(null);
    const [groupIcon, setGroupIcon] = useState(null);
    const [name, setName] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [groupTitle, setGroupTitle] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [pendingRemoveId, setPendingRemoveId] = useState(null);
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Name is required');
            return;
        }
        try {
            await addParticipant(name.trim(), photoFile || ''); // ✅ pass File directly
        }
        catch (err) {
            console.error('Error adding participant:', err);
            setError('Could not add participant.');
            return;
        }
        // Reset form
        setName('');
        setPhotoFile(null);
        setError('');
        if (fileInputRef.current)
            fileInputRef.current.value = '';
    };
    const toggleSelect = (id) => {
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]);
    };
    const handleRemove = async (id) => {
        await removeParticipant(id);
        setSelectedIds((prev) => prev.filter((pid) => pid !== id));
    };
    const handleStartSimulation = async () => {
        if (selectedIds.length === 0) {
            setError('Please select at least one participant.');
            return;
        }
        const allParticipants = useChatStore.getState().participants;
        const selectedParticipants = selectedIds
            .map(id => allParticipants.find(p => p.id === id))
            .filter(Boolean);
        const currentUser = allParticipants.find(p => p.id === userId);
        if (!currentUser) {
            setError('Current user not found in participants.');
            return;
        }
        let groupIconUrl = null;
        if (selectedParticipants.length + 1 > 2 && groupIcon) {
            try {
                groupIconUrl = URL.createObjectURL(groupIcon);
            }
            catch (err) {
                console.error('Could not read group icon');
            }
        }
        const chat = {
            id: `chat-${Date.now()}`,
            user_id: userId,
            is_group: selectedParticipants.length + 1 > 2,
            title: selectedParticipants.length + 1 > 2 ? groupTitle.trim() || 'Group Chat' : null,
            group_icon: groupIconUrl,
            participant_ids: [userId, ...selectedIds],
        };
        setChatMeta(chat.id, chat);
        setActiveChat(chat.id);
        setActiveParticipants([currentUser, ...selectedParticipants]); // ✅ Include current user
        navigate('/chat');
        setGroupTitle('');
    };
    const startEdit = (participant) => {
        setEditId(participant.id);
        setEditName(participant.name);
        setEditPhoto(null); // New image will be selected
    };
    const handleSaveEdit = async (id) => {
        const existingParticipant = participants.find(p => p.id === id);
        const existingPhoto = existingParticipant?.photo || '/default-avatar.png';
        let photoToUse = existingPhoto;
        if (editPhoto) {
            photoToUse = URL.createObjectURL(editPhoto); // ✅ convert to usable URL
        }
        const updatePayload = {
            name: editName.trim(),
            photo: photoToUse,
        };
        try {
            await useChatStore.getState().updateParticipant(id, updatePayload);
            // Cleanup
            setEditId(null);
            setEditName('');
            setEditPhoto(null);
        }
        catch (err) {
            console.error('Error updating participant:', err);
            setError('Failed to update participant.');
        }
    };
    const handleLogout = () => {
        clearUser();
        navigate('/');
    };
    const handleDelete = async () => {
        setShowConfirmModal(true);
    };
    const confirmDelete = async () => {
        await deleteAccount();
        setShowConfirmModal(false);
        navigate('/');
    };
    return (_jsxs("div", { className: styles.dashboard, children: [_jsxs("h2", { className: styles.title, children: ["Welcome ", _jsxs("span", { className: styles.welcomeName, children: [" ", userName || "nothing yet"] })] }), _jsx("h2", { className: styles.title, children: "Chat Simulation Dashboard" }), _jsxs("div", { className: styles.actionContainer, children: [_jsx(BackButton, {}), _jsx("button", { onClick: resetApp, className: styles.resetButton, children: "Reset App" }), _jsx("button", { onClick: handleLogout, className: styles.logoutButton, children: "Logout" }), _jsx("button", { onClick: handleDelete, className: styles.deleteButton, children: "Delete Account" })] }), _jsxs("div", { className: styles.content, children: [_jsxs("div", { className: styles.sectionWrapper, children: [_jsxs("div", { className: styles.sideSection, children: [_jsx("h3", { children: "Add New Participant" }), _jsxs("form", { onSubmit: handleAdd, className: styles.form, children: [_jsx("input", { type: "text", placeholder: "Enter participant name", value: name, onChange: (e) => {
                                                    setName(e.target.value);
                                                    setError('');
                                                }, className: styles.input }), _jsx("input", { type: "file", accept: "image/*", ref: fileInputRef, onChange: (e) => setPhotoFile(e.target.files ? e.target.files[0] : null), className: styles.input, id: "imageUpload", style: { display: 'none' } }), _jsx("label", { htmlFor: "imageUpload", className: styles.uploadButton, children: "Choose Display picture" }), _jsx("button", { type: "submit", className: styles.button, children: "Add Participant" }), error && _jsx("p", { className: styles.error, children: error })] })] }), _jsxs("div", { className: styles.sideSection, style: { opacity: selectedIds.length > 1 ? 1 : 0.5, pointerEvents: selectedIds.length > 1 ? 'auto' : 'none' }, children: [selectedIds.length < 2 && _jsx("h3", { children: "Select More partcipants to acitvate Group Chat" }), _jsx("h4", { children: "Group Chat Setup" }), _jsx("input", { type: "text", placeholder: "Enter group title", value: groupTitle, onChange: (e) => setGroupTitle(e.target.value), className: styles.input, disabled: selectedIds.length <= 1 }), _jsx("input", { type: "file", accept: "image/*", onChange: (e) => {
                                            const file = e.target.files?.[0];
                                            if (file)
                                                setGroupIcon(file);
                                        }, className: styles.input, disabled: selectedIds.length <= 1 })] })] }), _jsxs("div", { className: styles.listSection, children: [_jsx("h3", { children: "Select Participants" }), participants.length === 0 ? (_jsx("p", { className: styles.empty, children: "No participants yet." })) : (_jsx("ul", { className: styles.list, children: participants.map((p) => {
                                    const isEditing = editId === p.id;
                                    return (_jsx("li", { className: styles.participantItem, children: _jsxs("div", { className: styles.participantLabel, children: [_jsx("input", { type: "checkbox", checked: p.id === userId || selectedIds.includes(p.id), disabled: p.id === userId, onChange: () => {
                                                        if (p.id !== userId)
                                                            toggleSelect(p.id);
                                                    } }), _jsx("span", { className: styles.participantName, children: p.id === userId && _jsx("span", { className: styles.currentUserLabel, children: "(You)" }) }), isEditing ? (_jsxs("div", { children: [_jsx("input", { type: "text", value: editName, onChange: (e) => setEditName(e.target.value), className: styles.input }), _jsx("input", { type: "file", accept: "image/*", onChange: (e) => setEditPhoto(e.target.files ? e.target.files[0] : null), className: styles.input })] })) : (_jsxs(_Fragment, { children: [_jsx("img", { src: p.photo, alt: p.name, className: styles.avatar }), _jsx("span", { className: styles.participantName, children: p.name })] })), isEditing ? (_jsxs("div", { className: styles.buttonGroupEdit, children: [_jsx("button", { className: styles.saveButton, onClick: () => handleSaveEdit(p.id), children: "Save" }), _jsx("button", { className: styles.cancelButton, onClick: () => setEditId(null), children: "Cancel" })] })) : (_jsx(_Fragment, { children: _jsxs("div", { className: styles.edit, children: [_jsx("button", { className: styles.editButton, onClick: () => startEdit(p), children: "\u270E" }), p.id !== userId && (_jsx("button", { className: styles.removeButton, onClick: () => {
                                                                    setPendingRemoveId(p.id);
                                                                    setShowRemoveModal(true);
                                                                }, children: "\u2715" }))] }) }))] }) }, p.id));
                                }) })), error && _jsx("p", { className: styles.error, children: error }), _jsx("button", { onClick: handleStartSimulation, className: styles.button, disabled: participants.length === 0, children: "Start Simulation" })] })] }), showConfirmModal && (_jsx("div", { className: styles.overlay, children: _jsxs("div", { className: styles.modal, children: [_jsx("p", { className: styles.modalText, children: "Are you sure you want to delete your account? This cannot be undone." }), _jsxs("div", { className: styles.Edit, children: [_jsx("button", { onClick: confirmDelete, className: styles.confirmButton, children: "Yes, Delete" }), _jsx("button", { onClick: () => setShowConfirmModal(false), className: styles.cancelButton, children: "Cancel" })] })] }) })), showRemoveModal && (_jsx("div", { className: styles.overlay, children: _jsxs("div", { className: styles.modal, children: [_jsx("p", { className: styles.modalText, children: "Are you sure you want to remove this participant?" }), _jsxs("div", { className: styles.Edit, children: [_jsx("button", { onClick: async () => {
                                        if (pendingRemoveId) {
                                            await handleRemove(pendingRemoveId);
                                            setPendingRemoveId(null);
                                            setShowRemoveModal(false);
                                        }
                                    }, className: styles.confirmButton, children: "Yes, Remove" }), _jsx("button", { onClick: () => {
                                        setShowRemoveModal(false);
                                        setPendingRemoveId(null);
                                    }, className: styles.cancelButton, children: "Cancel" })] })] }) }))] }));
}
;
