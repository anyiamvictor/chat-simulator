
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  fetchParticipants,
   addParticipant as apiAddParticipant ,
  removeParticipant as apiRemoveParticipant,
  updateParticipant as apiUpdateParticipant,
  clearAllParticipantsExceptUser,
  loginWithEmail,
  ensureUserParticipant,
  registerNewUser,
  deleteUserAccount

} from '@/utils/api';
import { supabase } from '@/utils/superbaseClient';


//User
export type User = {
  id: string;
  name: string;
  email: string;
};

// Participant shape
export type Participant = {
  id: string;
  name: string;
  photo?: string;
  user_id: string; 
};

// Message shape
export type Message = {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
};

// Chat metadata
export type ChatMeta = {
  id: string;
  title?: string | null;
  is_group: boolean;
  participant_ids: string[];
   group_icon?: string|null;
  
};

// Chat store definition
type ChatStore = {
  user: User | null;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  participants: Participant[];
  activeParticipants: Participant[];
  activeChatId: string | null;
  chats: Record<string, Message[]>;
  chatMeta: Record<string, ChatMeta>;
  darkMode: boolean;
  isLoggedIn: boolean;
  activeSenderId: string | null;
  typingParticipantId: string | null;
    loading: boolean,

    
  


  setUser: (id: string, name: string, email:string) => void;
  setUserId: (id: string) => void;
  setActiveChat: (id: string) => void;
  setChatMeta: (chatId: string, meta: ChatMeta) => void;
  setActiveParticipants: (p: Participant[]) => void;

  // ✅ NEW actions:
  setActiveSender: (id: string) => void;
  setTypingParticipant: (id: string | null) => void;

  updateParticipant: (id: string, data: { name?: string; photo?: string }) => Promise<void>;
  toggleDarkMode: () => void;
  syncParticipantsFromServer: () => Promise<void>;
  loadInitialData: () => Promise<void>;
  addParticipant: (name: string, photo: string | File) => Promise<void>;
  removeParticipant: (id: string) => Promise<void>;
  sendMessage: (chatId: string, content: string, sender?: string) => void;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (name:string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resetApp: () => Promise<void>;
  clearUser: () => void;
  deleteAccount: () => Promise<void>
  setLoading: (isLoading: boolean) => void;

};


// Zustand store
export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      user: null,
      userId: null,
      userName: null,
      participants: [],
      activeParticipants: [],
      activeChatId: null,
      chats: {},
      chatMeta: {},
      activeSenderId: null,
      typingParticipantId: null,
      isLoggedIn: false,
      darkMode: false,
      userEmail: null,
      loading: false,

      setUserId: (id) => set({ userId: id }),
      setActiveChat: (id) => set({ activeChatId: id }),
      setActiveParticipants: (p) => set({ activeParticipants: p }),
      setActiveSender: (id) => set({ activeSenderId: id }),
      setTypingParticipant: (id) => set({ typingParticipantId: id }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setLoading: (value: boolean) => set({ loading: value }),
    

      loginUser: async (email, password) => {
        const { setLoading } = get();
        try {
          setLoading(true);
          const user = await loginWithEmail(email, password); // now from api.ts
          await ensureUserParticipant(user.id, user.name);     // still useful if you need a default participant
          set({
            userId: user.id,
            userName: user.name,
          });
        } finally { setLoading(false); }
      },


      syncParticipantsFromServer: async () => {
        const { userId, participants: localParticipants } = get();
        if (!userId) return;

        const userParticipants = await fetchParticipants(userId); // Supabase query

        const newOnes = userParticipants.filter(
          sp => !localParticipants.some(lp => lp.id === sp.id)
        );

        if (newOnes.length > 0) {
          set(state => ({
            participants: [...state.participants, ...newOnes],
          }));
        }
      },

      registerUser: async (name, email, password) => {
        const { setLoading } = get();
        try {
          setLoading(true);

          if (!email || !password || !name) {
            throw new Error('All fields are required');
          }
          if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
          }

          const user = await registerNewUser(email, password, name);

          if (!user || !user.id) {
            throw new Error('Registration failed. No user returned.');
          }

          // Add to users table
          const { error: userInsertError } = await supabase.from('users').insert({
            id: user.id,
            name,
            email,
          });

          if (userInsertError) {
            throw new Error(userInsertError.message);
          }

          await ensureUserParticipant(user.id, name);

          get().setUser(user.id, name, email);
        } catch (err: any) {
          // Surface meaningful error to the component
          throw new Error(err.message || 'Registration failed.');
        } finally {
          setLoading(false);
        }
      },


      logout: () => {
        set({
          user: null,
          isLoggedIn: false,
          userId: null,
          userName: null,
          activeChatId: null,
          activeSenderId: null,
          typingParticipantId: null,
          participants: [],
          activeParticipants: [],
          chats: {},
          chatMeta: {},
        });
      },

  
      updateParticipant: async (id, data) => {
        const { setLoading } = get();
        try {
          setLoading(true);
          const updated = await apiUpdateParticipant(id, data);
          set(state => ({
            participants: state.participants.map(p =>
              p.id === id ? { ...p, ...updated } : p
            ),
          }));
        } finally { setLoading(false); }
      },


      clearUser: () => set(() => ({
        userId: null,
        userName: null,
        participants: [],
        activeChatId: null,
        chatMeta: {},
        chats: {},
      })),
   
      setChatMeta: (chatId: string, meta: ChatMeta) =>
        set((state) => ({
          chatMeta: {
            ...state.chatMeta,
            [chatId]: meta,
          },
        })),

  
      loadInitialData: async () => {
        const userId = get().userId;
        if (!userId) return;

        const participants = await fetchParticipants(userId);

        set({
          participants,
          chats: {},
          chatMeta: {},
        });
      },


      setUser: (id: string, name: string, email: string) => {
        const photo = `https://robohash.org/${id}?set=set3`;
        const user: User = { id, name, email };
        const participant: Participant = { id, name, photo, user_id: id };

        set((state) => {
          const isAlreadyParticipant = state.participants.some(p => p.id === id);
          return {
            user,
            userId: id,
            userName: name,
            isLoggedIn: true,
            participants: isAlreadyParticipant ? state.participants : [...state.participants, participant],
            activeParticipants: isAlreadyParticipant ? state.activeParticipants : [...state.activeParticipants, participant],
            activeSenderId: null,
          };
        });
      },

      
      //   addParticipant: async (name, photo: string | File) => {
      //   const { setLoading, userId } = get();
      //   try {
      //     setLoading(true);
      //     if (!userId) return;

      //     const newParticipant = await apiAddParticipant(name, userId); // assumes photo handled elsewhere
      //     newParticipant.photo = typeof photo === 'string' ? photo : URL.createObjectURL(photo);
    

      //     set(state => ({
      //       participants: [...state.participants, newParticipant],
      //     }));
      //   } finally {
      //     setLoading(false);
      //   }
      // },
      addParticipant: async (name, photo: string | File) => {
        const { setLoading, userId } = get();
        try {
          setLoading(true);
          if (!userId) return;

          const newParticipant = await apiAddParticipant(name, userId);

          let finalPhoto: string;

          if (photo instanceof File) {
            finalPhoto = URL.createObjectURL(photo);
          } else if (typeof photo === 'string' && photo.trim()) {
            finalPhoto = photo;
          } else {
            // fallback to RoboHash using the actual participant's ID
            finalPhoto = `https://robohash.org/${newParticipant.id}?set=set3`;
          }

          newParticipant.photo = finalPhoto;


          set(state => ({
            participants: [...state.participants, newParticipant],
          }));
        } finally {
          setLoading(false);
        }
      },

      removeParticipant: async (id) => {
          const { setLoading } = get();
        try {
          setLoading(true);
          await apiRemoveParticipant(id);
          set(state => ({
            participants: state.participants.filter(p => p.id !== id),
          }));
        } finally {
          setLoading(false)
        }
      },


      sendMessage: (chatId: string, content: string, sender?: string) => {
        const actualSender = sender ?? get().activeSenderId;
        if (!actualSender) {
          console.warn('No sender specified or selected');
          return;
        }

        const newMessage: Message = {
          id: crypto.randomUUID(),
          sender: actualSender,
          content,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          chats: {
            ...state.chats,
            [chatId]: [...(state.chats[chatId] || []), newMessage],
          },
        }));
      },

      resetApp: async () => {
        const { userId } = get();
        if (!userId) return;

        await clearAllParticipantsExceptUser(userId);
        set({
          participants: [],
          chats: {},
          chatMeta: {},
          activeChatId: null,
        });
      },

    
      deleteAccount: async () => {
           const { setLoading } = get();
        try {
          setLoading(true);
        
          const userId = get().userId;
          if (!userId) return;

          // Delete user and their participants
          await deleteUserAccount(userId);

          // Clear Zustand state
          set({
            userId: null,
            userName: '',
            participants: [],
            chats: {},
            chatMeta: {},
            activeChatId: null,
          });
        }finally{setLoading(false)}
      },

    }),
    {
      name: 'chat-simulator-storage',
    }
  ),


)
