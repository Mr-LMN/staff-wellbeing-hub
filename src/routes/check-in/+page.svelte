<script lang="ts">
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/user';
  import { db } from '$lib/firestore';
  import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
    where,
    doc,
    getDoc,
    setDoc
  } from 'firebase/firestore';
  import type { WeightCheckin } from '$lib/types';

  let weight = '';
  let loading = false;
  let error: string | null = null;
  let checkins: WeightCheckin[] = [];
  let startWeight: number | null = null;
  let latestWeight: number | null = null;

  const loadData = async (uid: string) => {
    // Load profile to get start/latest if they exist
    const profileRef = doc(db, 'staff', uid);
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) {
      const data = profileSnap.data() as any;
      startWeight = data.startWeightKg ?? null;
      latestWeight = data.latestWeightKg ?? null;
    }

    const q = query(
      collection(db, 'checkins'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    checkins = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any)
    }));
  };

  onMount(async () => {
    const u = $user;
    if (!u) return;
    await loadData(u.uid);
  });

  $: loggedInUser = $user;

  const handleSubmit = async () => {
    error = null;
    if (!loggedInUser) {
      error = 'You must be logged in to record a check-in.';
      return;
    }
    const uid = loggedInUser.uid;

    const parsed = parseFloat(weight);
    if (Number.isNaN(parsed) || parsed <= 0) {
      error = 'Please enter a valid weight in kg.';
      return;
    }

    loading = true;
    try {
      const now = new Date().toISOString();

      await addDoc(collection(db, 'checkins'), {
        userId: uid,
        weightKg: parsed,
        createdAt: now
      });

      // Update profile with latest and maybe start weight
      const profileRef = doc(db, 'staff', uid);
      const profileSnap = await getDoc(profileRef);
      let profileData: any = profileSnap.exists() ? profileSnap.data() : {};
      if (profileData.startWeightKg == null) {
        profileData.startWeightKg = parsed;
      }
      profileData.latestWeightKg = parsed;
      profileData.updatedAt = now;

      await setDoc(profileRef, profileData, { merge: true });

      weight = '';
      await loadData(uid);
    } catch (err) {
      console.error(err);
      error =
        err instanceof Error ? err.message : 'Unable to save your check-in. Please try again.';
    } finally {
      loading = false;
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
</script>

<div class="space-y-6">
  <section class="space-y-1">
    <h1 class="text-xl font-semibold">Weekly Check-in</h1>
    <p class="text-sm text-slate-400">
      Log your weight once a week to track your progress privately.
    </p>
  </section>

  {#if !loggedInUser}
    <p class="text-sm text-slate-400">
      You need to be logged in to record check-ins.
      <a href="/login" class="text-emerald-400 hover:text-emerald-300 ml-1">Log in</a>
    </p>
  {:else}
    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3 md:col-span-2">
        <form class="space-y-3" on:submit|preventDefault={handleSubmit}>
          <div class="space-y-1">
            <label class="text-xs font-medium text-slate-300" for="weight-input">Weight this week (kg)</label>
            <input
              class="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              type="number"
              min="0"
              step="0.1"
              id="weight-input"
              bind:value={weight}
              placeholder="e.g. 92.3"
              required
            />
          </div>

          {#if error}
            <p class="text-xs text-red-400">{error}</p>
          {/if}

          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Saving...' : "Log this week's weight"}
          </button>
        </form>
      </div>

      <div class="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-2">
        <p class="text-xs text-slate-400 uppercase">Summary</p>
        <p class="text-sm text-slate-300">
          Start weight:
          <span class="font-medium">
            {#if startWeight !== null}{startWeight}kg{:else}—{/if}
          </span>
        </p>
        <p class="text-sm text-slate-300">
          Latest weight:
          <span class="font-medium">
            {#if latestWeight !== null}{latestWeight}kg{:else}—{/if}
          </span>
        </p>
        {#if startWeight !== null && latestWeight !== null}
          {#if latestWeight < startWeight}
            <p class="text-sm text-emerald-400">
              {Math.abs(latestWeight - startWeight).toFixed(1)}kg down since you started.
            </p>
          {:else if latestWeight > startWeight}
            <p class="text-sm text-amber-300">
              {Math.abs(latestWeight - startWeight).toFixed(1)}kg up since you started.
            </p>
          {:else}
            <p class="text-sm text-slate-400">Same as your starting weight.</p>
          {/if}
        {/if}
      </div>
    </div>

    <section class="space-y-2">
      <h2 class="text-sm font-semibold text-slate-200">Previous check-ins</h2>
      {#if checkins.length === 0}
        <p class="text-sm text-slate-400">No check-ins yet. Your first one will appear here.</p>
      {:else}
        <ul class="space-y-1 text-sm text-slate-300">
          {#each checkins as c}
            <li class="flex justify-between border-b border-slate-800/60 pb-1">
              <span>{formatDate(c.createdAt)}</span>
              <span class="font-medium">{c.weightKg}kg</span>
            </li>
          {/each}
        </ul>
      {/if}
    </section>
  {/if}
</div>
