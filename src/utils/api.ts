

import { supabase } from '@/utils/superbaseClient'

/**
 * PARTICIPANTS ONLY — since your DB only has `participants`
 */

// Fetch all participants for the current user
export const fetchParticipants = async (user_id: string) => {
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .eq('user_id', user_id)

  if (error) throw new Error(error.message)
  return data
}

// Add a new participant
export const addParticipant = async (name: string, user_id: string) => {
  const newParticipant = {
    id: crypto.randomUUID(),
    name,
    user_id,
  };

  const { data, error } = await supabase
    .from('participants')
    .insert(newParticipant)
    .select()
    .single();

  if (error) {
    console.error('❌ Supabase insert error:', error.message, error.details, error.hint);
    throw new Error('Failed to add participant');
  }

  return { ...data, photo: '' };
};



// Remove a participant by ID
export const removeParticipant = async (id: string) => {
  const { error } = await supabase
    .from('participants')
    .delete()
    .eq('id', id)

  if (error) throw new Error('Failed to delete participant')
  return true
}

// Update participant data
export const updateParticipant = async (
  id: string,
  updatedData: { name?: string; photo?: string }
) => {
  const { data, error } = await supabase
    .from('participants')
    .update(updatedData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error('Failed to update participant')
  return data
}

// Delete all participants except the current user
export const clearAllParticipantsExceptUser = async (userId: string) => {
  const { error } = await supabase
    .from('participants')
    .delete()
    .neq('id', userId)

  if (error) throw new Error('Failed to clear participants')
}

// Check if a participant exists for a user
export const ensureUserParticipant = async (userId: string, name: string) => {
  const { data: existing, error } = await supabase
    .from('participants')
    .select('*')
    .eq('user_id', userId)

  if (error) throw new Error(error.message)

  const exists = existing.some(p => p.user_id === userId)

  if (!exists) {
    const id = userId // or use crypto.randomUUID() if preferred
    await supabase.from('participants').insert({
      id,
      name,
      user_id: userId,
      photo: `https://robohash.org/${userId}?set=set3`
    })
  }
}

// Fetch all participants (for sync)
export const fetchAllParticipants = async () => {
  const { data, error } = await supabase.from('participants').select('*')
  if (error) throw new Error(error.message)
  return data
}

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('No user returned');

    return {
      id: data.user.id,
      name: data.user.user_metadata?.name || data.user.email,
    };
  } catch (err: any) {
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw err;
  }
};

export const registerNewUser = async (email: string, password: string, name: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('No user returned');

    return data.user;
  } catch (err: any) {
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw err;
  }
};



// Delete user account
// This function is used to delete a user account by calling a Supabase function.


export const deleteUserAccount = async (userId: string) => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    throw new Error('Not authenticated');
  }

  const accessToken = session.access_token;

  const response = await fetch('https://kocuqdfiaobytuyfwgqe.supabase.co/functions/v1/delete-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ userId }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to delete user');
  }

  return result;
};

