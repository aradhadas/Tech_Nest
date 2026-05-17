import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestLogin() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult({ step: 'Testing Supabase connection...' });
    
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      setResult({ 
        step: 'Connection test',
        success: !error,
        data,
        error: error?.message 
      });
    } catch (err) {
      setResult({ 
        step: 'Connection test',
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
    setLoading(false);
  };

  const testLogin = async () => {
    setLoading(true);
    setResult({ step: 'Attempting login...' });
    
    try {
      // Step 1: Try to login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setResult({
          step: 'Login failed',
          success: false,
          error: authError.message,
          details: authError
        });
        setLoading(false);
        return;
      }

      // Step 2: Try to fetch user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError) {
        setResult({
          step: 'User profile fetch failed',
          success: false,
          authSuccess: true,
          userId: authData.user.id,
          error: userError.message,
          details: userError
        });
        setLoading(false);
        return;
      }

      setResult({
        step: 'Login successful!',
        success: true,
        authUser: authData.user,
        profileUser: userData
      });
    } catch (err) {
      setResult({
        step: 'Unexpected error',
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
    setLoading(false);
  };

  const testRegister = async () => {
    setLoading(true);
    setResult({ step: 'Attempting registration...' });
    
    try {
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setResult({
          step: 'Registration failed',
          success: false,
          error: authError.message,
          details: authError
        });
        setLoading(false);
        return;
      }

      // Step 2: Create user profile
      const { error: profileError } = await supabase.from('users').insert([
        {
          id: authData.user!.id,
          name: 'Test User',
          email,
          role: 'customer',
          status: 'active',
          approval_status: 'approved',
        },
      ]);

      if (profileError) {
        setResult({
          step: 'Profile creation failed',
          success: false,
          authSuccess: true,
          userId: authData.user!.id,
          error: profileError.message,
          details: profileError
        });
        setLoading(false);
        return;
      }

      setResult({
        step: 'Registration successful!',
        success: true,
        user: authData.user
      });
    } catch (err) {
      setResult({
        step: 'Unexpected error',
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
    setLoading(false);
  };

  const checkAuthState = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    setResult({
      step: 'Current auth state',
      session,
      isLoggedIn: !!session
    });
    setLoading(false);
  };

  const checkUsersTable = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, role, status, approval_status')
        .limit(10);

      setResult({
        step: 'Users table query',
        success: !error,
        count: data?.length || 0,
        users: data,
        error: error?.message
      });
    } catch (err) {
      setResult({
        step: 'Users table query failed',
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Login Debug Tool</h1>

        {/* Input Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Credentials</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="test@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="password123"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
              onClick={testConnection}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Test Connection
            </button>
            <button
              onClick={checkAuthState}
              disabled={loading}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
            >
              Check Auth State
            </button>
            <button
              onClick={checkUsersTable}
              disabled={loading}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:bg-gray-400"
            >
              Check Users Table
            </button>
            <button
              onClick={testRegister}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              Test Register
            </button>
            <button
              onClick={testLogin}
              disabled={loading}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
            >
              Test Login
            </button>
            <button
              onClick={() => {
                supabase.auth.signOut();
                setResult({ step: 'Logged out' });
              }}
              disabled={loading}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-400"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <div className={`p-4 rounded ${result.success === false ? 'bg-red-50' : result.success === true ? 'bg-green-50' : 'bg-gray-50'}`}>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold mb-2">📝 Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li><strong>Test Connection</strong> - Verify Supabase is reachable</li>
            <li><strong>Check Users Table</strong> - See if users table exists and has data</li>
            <li><strong>Test Register</strong> - Create a new test user</li>
            <li><strong>Test Login</strong> - Try to login with the credentials above</li>
            <li><strong>Check Auth State</strong> - See if you're currently logged in</li>
          </ol>
          <p className="mt-4 text-sm text-gray-600">
            If any test fails, check the error message in the results section.
          </p>
        </div>
      </div>
    </div>
  );
}
