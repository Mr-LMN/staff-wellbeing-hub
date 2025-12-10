<script lang="ts">
  const loginWithMicrosoft = () => {
    alert('Microsoft login coming soon');
  };
</script>

<div class="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
  <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8 space-y-6">
    <div class="space-y-2 text-center">
      <h1 class="text-2xl font-semibold">Sign in with your @phschool.co.uk account</h1>
      <p class="text-sm text-slate-400">Access the Staff Wellbeing Hub with your Microsoft account.</p>
    </div>

    <button
      class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold py-3 rounded-xl transition"
      type="button"
      on:click={loginWithMicrosoft}
    >
      Sign in with Microsoft
    </button>
  </div>
</div>
