<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { logout } from '$lib/auth';
  import { user } from '$lib/stores/user';

  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/check-in', label: 'Check-in' },
    { href: '/workouts', label: 'Workouts' },
    { href: '/nutrition', label: 'Nutrition' },
    { href: '/stories', label: 'Stories' }
  ];

  const handleLogout = async () => {
    await logout();
    goto('/login');
  };
</script>

<div class="min-h-screen flex flex-col bg-slate-950 text-slate-100">
  <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
    <div class="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
      <a href="/" class="flex items-center gap-2 hover:opacity-90 transition-opacity">
        <div class="h-8 w-8 rounded-xl bg-emerald-500 flex items-center justify-center text-xs font-bold text-slate-900">
          PHS
        </div>
        <div>
          <p class="text-sm font-semibold">Staff Wellbeing Hub</p>
          <p class="text-xs text-slate-400">Pencoedtre High School</p>
        </div>
      </a>

      {#if $user}
        <div class="flex items-center gap-3">
          <span class="hidden md:inline text-xs text-slate-300">
            {$user.email}
          </span>
          <a href="/" class="hidden md:inline text-xs md:text-sm text-slate-300 hover:text-white">Home</a>
          <button
            class="text-xs md:text-sm text-slate-300 hover:text-white"
            on:click|preventDefault={handleLogout}
          >
            Log out
          </button>
        </div>
      {:else}
        <div class="flex items-center gap-3">
          <a href="/" class="text-xs md:text-sm text-slate-300 hover:text-white">Home</a>
          <a href="/login" class="text-xs md:text-sm text-slate-300 hover:text-white">Log in</a>
        </div>
      {/if}
    </div>
  </header>

  <main class="flex-1 mx-auto w-full max-w-5xl px-4 py-6 md:py-10">
    <slot />
  </main>

  <!-- Mobile bottom nav -->
  <nav class="md:hidden sticky bottom-0 border-t border-slate-800 bg-slate-900/90 backdrop-blur">
    <div class="flex justify-around py-2 text-xs">
      {#each links as link}
        <a
          href={link.href}
          class={`flex flex-col items-center ${
            $page.url.pathname === link.href
              ? 'text-emerald-400 font-semibold'
              : 'text-slate-400'
          }`}
        >
          {link.label}
        </a>
      {/each}
    </div>
  </nav>
</div>
