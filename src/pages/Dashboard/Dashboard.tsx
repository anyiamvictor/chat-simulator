import { useState, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { Participant } from '@/store/useChatStore';
import BackButton from '@/components/BackButton/BackButton';




export default function Dashboard() {
  const {
    participants,
    addParticipant,
    removeParticipant,
    setActiveChat,
    setChatMeta,
    setActiveParticipants,
    resetApp,
    clearUser,
    deleteAccount
  } = useChatStore();


  const userId = useChatStore(state => state.userId);
  const userName = useChatStore(state => state.userName);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhoto, setEditPhoto] = useState<File | null>(null);
  const [groupIcon, setGroupIcon] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [groupTitle, setGroupTitle] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
const [showRemoveModal, setShowRemoveModal] = useState(false);
const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);



  
 

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Name is required');
      return;
    }


    try {
      await addParticipant(name.trim(), photoFile || ''); // ✅ pass File directly
    } catch (err) {
      console.error('Error adding participant:', err);
      setError('Could not add participant.');
      return;
    }

    // Reset form
    setName('');
    setPhotoFile(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };


  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleRemove = async (id: string) => {
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
      .filter(Boolean) as Participant[];

    const currentUser = allParticipants.find(p => p.id === userId);
    if (!currentUser) {
      setError('Current user not found in participants.');
      return;
    }

let groupIconUrl: string | null = null;

if (selectedParticipants.length + 1 > 2 && groupIcon) {
  try {
    groupIconUrl = URL.createObjectURL(groupIcon);
  } catch (err) {
    console.error('Could not read group icon');
  }
}

    

    const chat = {
      id: `chat-${Date.now()}`,
      user_id: userId,
      is_group: selectedParticipants.length + 1 > 2,
      title: selectedParticipants.length + 1 > 2 ? groupTitle.trim() || 'Group Chat' : null,
      group_icon: groupIconUrl,
      participant_ids: [userId!, ...selectedIds],
    };

    setChatMeta(chat.id, chat);
    setActiveChat(chat.id);
    setActiveParticipants([currentUser, ...selectedParticipants]); // ✅ Include current user
    navigate('/chat');
    setGroupTitle('');
  };


  const startEdit = (participant: Participant) => {
    setEditId(participant.id);
    setEditName(participant.name);
    setEditPhoto(null); // New image will be selected
  };

 const handleSaveEdit = async (id: string) => {
  const existingParticipant = participants.find(p => p.id === id);
  const existingPhoto = existingParticipant?.photo || '/default-avatar.png';

  let photoToUse: string | File = existingPhoto;

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
  } catch (err) {
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
  

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.title}>Welcome <span className={styles.welcomeName}> {userName || "nothing yet"}</span></h2>
      <h2 className={styles.title}>Chat Simulation Dashboard</h2>
   
      <div className={styles.actionContainer}>
        <BackButton />

        <button onClick={resetApp} className={styles.resetButton}>
          Reset App
        </button>

        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>

        <button onClick={handleDelete} className={styles.deleteButton}>
          Delete Account
        </button>
        
      </div>


      <div className={styles.content}>
        {/* Add Participant */}
        <div className={styles.sectionWrapper}>

          <div className={styles.sideSection}>
          <h3>Add New Participant</h3>
          <form onSubmit={handleAdd} className={styles.form}>
            <input
              type="text"
              placeholder="Enter participant name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className={styles.input}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => setPhotoFile(e.target.files ? e.target.files[0] : null)}
              className={styles.input}
              id="imageUpload"
              style={{ display: 'none' }} // Hide the native input
            />

            <label htmlFor="imageUpload" className={styles.uploadButton}>
              Choose Display picture
            </label>

            <button type="submit" className={styles.button}>
              Add Participant
            </button>
            {error && <p className={styles.error}>{error}</p>}
          </form>
          </div>

           <div className={styles.sideSection} style={{ opacity: selectedIds.length > 1 ? 1 : 0.5, pointerEvents: selectedIds.length > 1 ? 'auto' : 'none' }}>
          {selectedIds.length < 2 && <h3>Select More partcipants to acitvate Group Chat</h3>}
          <h4>Group Chat Setup</h4>

          <input
            type="text"
            placeholder="Enter group title"
            value={groupTitle}
            onChange={(e) => setGroupTitle(e.target.value)}
            className={styles.input}
            disabled={selectedIds.length <= 1}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setGroupIcon(file);
            }}
            className={styles.input}
            disabled={selectedIds.length <= 1}
          />
          </div>
        </div>
        

        {/* Participant List */}
          <div className={styles.listSection}>
            <h3>Select Participants</h3>
            {participants.length === 0 ? (
              <p className={styles.empty}>No participants yet.</p>
            ) : (
              <ul className={styles.list}>
                {participants.map((p) => {
                  const isEditing = editId === p.id;

                  return (
                    <li key={p.id} className={styles.participantItem}>
                      <div className={styles.participantLabel}>
                        <input
                          type="checkbox"
                          checked={p.id === userId || selectedIds.includes(p.id)}
                          disabled={p.id === userId}
                          onChange={() => {
                            if (p.id !== userId) toggleSelect(p.id);
                          }}
                        />

                        <span className={styles.participantName}>
                          {p.id === userId && <span className={styles.currentUserLabel}>(You)</span>}
                        </span>



                        {isEditing ? (
                          <div>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className={styles.input}
                            />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setEditPhoto(e.target.files ? e.target.files[0] : null)
                              }
                              className={styles.input}
                            />
                          </div>
                        ) : (
                          <>
                            <img src={p.photo} alt={p.name} className={styles.avatar} />
                            <span className={styles.participantName}>{p.name}</span>
                          </>
                        )}

                        {isEditing ? (
                          <div className={styles.buttonGroupEdit}>
                            <button
                              className={styles.saveButton}
                              onClick={() => handleSaveEdit(p.id)}
                            >
                              Save
                            </button>
                            <button
                              className={styles.cancelButton}
                              onClick={() => setEditId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className={styles.edit}>

                              <button
                                className={styles.editButton}
                                onClick={() => startEdit(p)}
                              >
                                ✎
                              </button>
                              {p.id !== userId && (
                                <button
                                  className={styles.removeButton}
                                  onClick={() => {
                                    setPendingRemoveId(p.id);
                                    setShowRemoveModal(true);
                                  }}
                                >
                                  ✕
                                </button>


                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}

              </ul>
            )}

        
          {error && <p className={styles.error}>{error}</p>}
          


               
    <button
            onClick={handleStartSimulation}
            className={styles.button}
            disabled={participants.length === 0}
          >
            Start Simulation
          </button>
          </div>

 
       
      </div>

      
      {showConfirmModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <p className={styles.modalText}>
              Are you sure you want to delete your account? This cannot be undone.
            </p>
            <div className={styles.Edit}>
              <button onClick={confirmDelete} className={styles.confirmButton}>
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showRemoveModal && (
  <div className={styles.overlay}>
    <div className={styles.modal}>
      <p className={styles.modalText}>
        Are you sure you want to remove this participant?
      </p>
      <div className={styles.Edit}>
        <button
          onClick={async () => {
            if (pendingRemoveId) {
              await handleRemove(pendingRemoveId);
              setPendingRemoveId(null);
              setShowRemoveModal(false);
            }
          }}
          className={styles.confirmButton}
        >
          Yes, Remove
        </button>
        <button
          onClick={() => {
            setShowRemoveModal(false);
            setPendingRemoveId(null);
          }}
          className={styles.cancelButton}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


    </div>

    
  );
};