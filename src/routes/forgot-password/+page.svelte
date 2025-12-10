<script lang="ts">
  import { sendReset } from '$lib/auth';

  let email = '';
  let message: string | null = null;
  let error: string | null = null;
  let loading = false;

  const handleReset = async () => {
    message = null;
    error = null;
    loading = true;
    try {
      await sendReset(email.trim());
      message = 'If that email exists, a reset link has been sent.';
    } catch (err) {
      console.error(err);
      error =
        err instanceof Error ? err.message : 'Unable to send reset email. Please try again.';
    } finally {
      loading = false;
    }
  };
</script>

<div class="min-h-[70vh] flex items-center justify-center">
  <div class="w-full max-w-md rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl">
    <div class="mb-6 text-center space-y-1">
      <p class="text-xs font-semibold tracking-wide text-emerald-400 uppercase">
        Password reset
      </p>
      <h1 class="text-xl font-semibold">Reset your password</h1>
      <p class="text-sm text-slate-400">
        Enter your <span class="font-mono">@phschool.co.uk</span> email and we’ll send you a reset link.
      </p>
    </div>

    <form class="space-y-3" on:submit|preventDefault={handleReset}>
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

      {#if message}
        <p class="text-xs text-emerald-400">{message}</p>
      {/if}
      {#if error}
        <p class="text-xs text-red-400">{error}</p>
      {/if}

      <button
        type="submit"
        class="w-full inline-flex items-center justify-center rounded-xl border border-slate-700 bg-emerald-500 px-4 py-2.5 text-sm font-medium text-slate-950 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Sending link...' : 'Send reset link'}
      </button>
    </form>

    <p class="mt-4 text-[11px] text-slate-400 text-center">
      Remembered it?
      <a href="/login" class="hover:text-slate-200">Back to login</a>
    </p>
  </div>
</div>
