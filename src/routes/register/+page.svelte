<script lang="ts">
  import { goto } from '$app/navigation';
  import { registerWithEmail } from '$lib/auth';

  let email = '';
  let password = '';
  let confirmPassword = '';
  let error: string | null = null;
  let loading = false;

  const handleRegister = async () => {
    error = null;

    if (password.length < 6) {
      error = 'Password must be at least 6 characters.';
      return;
    }
    if (password !== confirmPassword) {
      error = 'Passwords do not match.';
      return;
    }

    loading = true;
    try {
      await registerWithEmail(email.trim(), password);
      goto('/');
    } catch (err) {
      console.error(err);
      error =
        err instanceof Error ? err.message : 'Registration failed. Please try again.';
    } finally {
      loading = false;
    }
  };
</script>

<div class="min-h-[70vh] flex items-center justify-center">
  <div class="w-full max-w-md rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl">
    <div class="mb-6 text-center space-y-1">
      <p class="text-xs font-semibold tracking-wide text-emerald-400 uppercase">
        Pencoedtre High School
      </p>
      <h1 class="text-xl font-semibold">Create your account</h1>
      <p class="text-sm text-slate-400">
        Use your <span class="font-mono">@phschool.co.uk</span> staff email.
      </p>
    </div>

    <form class="space-y-3" on:submit|preventDefault={handleRegister}>
      <div class="space-y-1">
        <label class="text-xs font-medium text-slate-300">Email</label>
        <input
          class="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500"
          type="email"
          bind:value={email}
          placeholder="you@phschool.co.uk"
          required
        />
      </div>

      <div class="space-y-1">
        <label class="text-xs font-medium text-slate-300">Password</label>
        <input
          class="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500"
          type="password"
          bind:value={password}
          minlength="6"
          required
        />
      </div>

      <div class="space-y-1">
        <label class="text-xs font-medium text-slate-300">Confirm password</label>
        <input
          class="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500"
          type="password"
          bind:value={confirmPassword}
          minlength="6"
          required
        />
      </div>

      {#if error}
        <p class="text-xs text-red-400">{error}</p>
      {/if}

      <button
        type="submit"
        class="w-full inline-flex items-center justify-center rounded-xl border border-slate-700 bg-emerald-500 px-4 py-2.5 text-sm font-medium text-slate-950 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>

    <p class="mt-4 text-[11px] text-slate-400 text-center">
      Already have an account?
      <a href="/login" class="hover:text-slate-200">Log in</a>
    </p>
  </div>
</div>
