<script lang="ts">
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/user';
  import { db } from '$lib/firestore';
  import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
  import type { NewsItem } from '$lib/types';

  let name = 'Staff member';
  let currentWeight: number | null = null;
  let startWeight: number | null = null;
  let changeText = 'No data yet';
  let tip =
    'Take one 10-minute walk between lessons this week. Small wins add up.';
  let news: NewsItem[] = [];

  $: loggedInUser = $user;

  const formatNewsDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  onMount(async () => {
    const u = $user;
    if (u) {
      name = u.email?.split('@')[0] ?? 'Staff member';

      const q = query(
        collection(db, 'checkins'),
        where('userId', '==', u.uid),
        orderBy('createdAt', 'asc')
      );
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => d.data() as any);

      if (docs.length > 0) {
        const firstWeight = docs[0].weightKg as number;
        const latestWeight = docs[docs.length - 1].weightKg as number;

        startWeight = firstWeight;
        currentWeight = latestWeight;

        const diff = latestWeight - firstWeight;
        if (diff < 0) {
          changeText = `${Math.abs(diff).toFixed(1)}kg down since you started`;
        } else if (diff > 0) {
          changeText = `${diff.toFixed(1)}kg up since you started`;
        } else {
          changeText = 'Same as your starting weight';
        }
      } else {
        startWeight = null;
        currentWeight = null;
        changeText = 'No check-ins yet';
      }
    }

    const nq = query(
      collection(db, 'news'),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(nq);
    news = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any)
    }));
  });
</script>

<div class="space-y-6">
  <section>
    <h1 class="text-2xl font-bold text-slate-100">Welcome back, {name} 👋</h1>
    <p class="text-slate-400 text-sm mt-1">
      Your private staff wellbeing dashboard.
    </p>
  </section>

  <!-- Top cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow">
      <p class="text-xs text-slate-400 uppercase">This Week</p>
      <p class="text-3xl mt-2 font-bold">
        {#if currentWeight !== null}
          {currentWeight}kg
        {:else}
          —
        {/if}
      </p>
      <p class="text-sm text-slate-400">Current logged weight</p>
      <p
        class="mt-4 text-sm {currentWeight !== null && startWeight !== null && currentWeight < startWeight ? 'text-emerald-400' : 'text-slate-300'}"
      >
        {changeText}
      </p>
    </div>

    <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow flex flex-col justify-between">
      <div>
        <p class="text-xs text-slate-400 uppercase">Goal</p>
        <p class="text-lg font-semibold mt-2">Lose 5kg by Easter</p>
        <p class="text-sm text-slate-400">You're on track based on weekly trend.</p>
      </div>
      <a
        href="/check-in"
        class="mt-4 py-2 px-3 rounded-xl bg-emerald-500 text-slate-900 font-medium text-center hover:bg-emerald-400"
      >
        Log this week's weight
      </a>
    </div>

    <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow flex flex-col justify-between">
      <p class="text-xs text-slate-400 uppercase">Micro Tip</p>
      <p class="mt-2 text-sm text-slate-200">{tip}</p>
      <a href="/nutrition" class="mt-4 text-sm text-slate-300 hover:text-white">
        See more tips →
      </a>
    </div>
  </div>

  <!-- Quick action cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <a
      href="/workouts"
      class="p-6 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700 shadow hover:bg-slate-800"
    >
      <p class="text-xs text-slate-400 uppercase">Move</p>
      <h2 class="text-lg font-semibold mt-2">Start a 10–20 minute home workout</h2>
      <p class="text-sm text-slate-400 mt-1">No equipment needed. Teacher-friendly.</p>
      <p class="text-emerald-400 text-sm font-medium mt-4">Browse workouts →</p>
    </a>

    <a
      href="/stories"
      class="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow hover:bg-slate-800"
    >
      <p class="text-xs text-slate-400 uppercase">Real People</p>
      <h2 class="text-lg font-semibold mt-2">Read staff progress stories</h2>
      <p class="text-sm text-slate-400 mt-1">
        Anonymous unless staff choose otherwise.
      </p>
      <p class="text-slate-300 text-sm font-medium mt-4">View stories →</p>
    </a>
  </div>

  <section class="space-y-2 mt-4">
    <h2 class="text-sm font-semibold text-slate-200">Latest updates</h2>
    {#if news.length === 0}
      <p class="text-sm text-slate-400">
        No updates yet. Check back soon for staff circuits bookings, new recipes, and wellbeing tips.
      </p>
    {:else}
      <div class="space-y-2">
        {#each news as item}
          <article class="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-1">
            <h3 class="text-sm font-semibold text-slate-100">{item.title}</h3>
            {#if item.body}
              <p class="text-sm text-slate-400">{item.body}</p>
            {/if}
            <div class="flex justify-between items-center mt-1 text-xs text-slate-500">
              <span>{formatNewsDate(item.createdAt)}</span>
              {#if item.ctaLabel && item.ctaUrl}
                <a
                  href={item.ctaUrl}
                  class="text-emerald-400 hover:text-emerald-300 font-medium"
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.ctaLabel} →
                </a>
              {/if}
            </div>
          </article>
        {/each}
      </div>
    {/if}
  </section>
</div>
