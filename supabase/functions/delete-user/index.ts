// supabase/functions/delete-user/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
serve(async (req)=>{
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('OK', {
      headers: corsHeaders
    });
  }
  const { userId } = await req.json();
  if (!userId) {
    return new Response(JSON.stringify({
      error: 'Missing userId'
    }), {
      status: 400,
      headers: corsHeaders
    });
  }
  const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
  // 1. Delete participants
  const { error: partErr } = await supabase.from('participants').delete().eq('user_id', userId);
  if (partErr) {
    return new Response(JSON.stringify({
      error: 'Failed to delete participants'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
  // 2. Delete user row
  const { error: userErr } = await supabase.from('users').delete().eq('id', userId);
  if (userErr) {
    return new Response(JSON.stringify({
      error: 'Failed to delete user record'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
  // 3. Delete auth user
  const { error: authErr } = await supabase.auth.admin.deleteUser(userId);
  if (authErr) {
    return new Response(JSON.stringify({
      error: 'Failed to delete auth user'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
  return new Response(JSON.stringify({
    message: 'User and data deleted successfully'
  }), {
    status: 200,
    headers: corsHeaders
  });
});

