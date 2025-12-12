<script lang="ts">
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/user';
  import { db } from '$lib/firestore';
  import {
    collection,
    addDoc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    doc,
    serverTimestamp
  } from 'firebase/firestore';
  import type { NewsItem } from '$lib/types';

  const ALLOWED_ADMINS = ['your.email@phschool.co.uk'];

  let title = '';
  let category: NewsItem['category'] = 'general';
  let tagsText = '';
  let body = '';
  let pinToBanner = false;
  let ctaLabel = '';
  let ctaUrl = '';
  let saving = false;
  let error: string | null = null;

  let news: NewsItem[] = [];

  $: currentUser = $user;
  $: isAdmin =
    currentUser?.email && ALLOWED_ADMINS.includes(currentUser.email.toLowerCase());

  const loadNews = async () => {
    if (!isAdmin) return;
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    news = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any)
    }));
  };

  onMount(async () => {
    await loadNews();
  });

  $: if (isAdmin) {
    loadNews();
  }

  const handleCreate = async () => {
    error = null;

    if (!isAdmin) {
      error = 'You are not authorised to create news posts.';
      return;
    }
    if (!title.trim()) {
      error = 'Title is required.';
      return;
    }
    if (!body.trim()) {
      error = 'Body is required.';
      return;
    }

    saving = true;
    try {
      const tagArray = tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const nowIso = new Date().toISOString();

      await addDoc(collection(db, 'news'), {
        title: title.trim(),
        body: body.trim(),
        createdAt: nowIso,
        category,
        tags: tagArray,
        pinToBanner,
        ctaLabel: ctaLabel.trim() || null,
        ctaUrl: ctaUrl.trim() || null,
        heroImageUrl: null
      });

      title = '';
      body = '';
      tagsText = '';
      pinToBanner = false;
      ctaLabel = '';
      ctaUrl = '';
      category = 'general';

      await loadNews();
    } catch (err) {
      console.error(err);
      error =
        err instanceof Error
          ? err.message
          : 'Failed to create news item. Please try again.';
    } finally {
      saving = false;
    }
  };

  const togglePin = async (item: NewsItem) => {
    if (!item.id || !isAdmin) return;
    const ref = doc(db, 'news', item.id);
    await updateDoc(ref, { pinToBanner: !item.pinToBanner });
    await loadNews();
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
    <h1 class="text-xl font-semibold">News & updates (admin)</h1>
    <p class="text-sm text-slate-400">
      Create and manage internal updates for the staff wellbeing hub.
    </p>
  </section>

  {#if !currentUser}
    <p class="text-sm text-slate-400">
      You must be logged in to access this page.
    </p>
  {:else if !isAdmin}
    <p class="text-sm text-slate-400">
      You are not authorised to manage news. If you think this is a mistake, speak to the site admin.
    </p>
  {:else}
    <div class="grid gap-4 md:grid-cols-2">
      <!-- Create form -->
      <div class="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
        <h2 class="text-sm font-semibold text-slate-200">Create news item</h2>

        {#if error}
          <p class="text-xs text-red-400">{error}</p>
        {/if}

        <div class="space-y-1">
          <label class="text-xs font-medium text-slate-300">Title</label>
          <input
            class="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            bind:value={title}
            placeholder="e.g. Book staff circuits for Monday"
          />
        </div>

        <div class="space-y-1">
          <label class="text-xs font-medium text-slate-300">Category</label>
          <select
            class="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            bind:value={category}
          >
            <option value="general">General</option>
            <option value="nutrition">Nutrition</option>
            <option value="exercise">Exercise tips</option>
            <option value="workouts">Workouts</option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-medium text-slate-300">Tags (comma separated)</label>
          <input
            class="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            bind:value={tagsText}
            placeholder="e.g. recipe, family, quick"
          />
        </div>

        <div class="flex items-center gap-2">
          <input
            id="pin"
            type="checkbox"
            class="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500"
            bind:checked={pinToBanner}
          />
          <label for="pin" class="text-xs text-slate-300">
            Show in home banner / latest updates
          </label>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-medium text-slate-300">Body (markdown)</label>
          <textarea
            class="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500 min-h-[120px]"
            bind:value={body}
            placeholder="Write your update here. Use markdown for headings, bold, lists etc."
          />
          <p class="text-[10px] text-slate-500">
            Markdown supported – e.g. <code>### Heading</code>, <code>**bold**</code>, <code>- list item</code>.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="space-y-1">
            <label class="text-xs font-medium text-slate-300">CTA label (optional)</label>
            <input
              class="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              bind:value={ctaLabel}
              placeholder="e.g. Email Lloyd"
            />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-medium text-slate-300">CTA URL (optional)</label>
            <input
              class="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              bind:value={ctaUrl}
              placeholder="e.g. mailto:you@phschool.co.uk"
            />
          </div>
        </div>

        <button
          on:click|preventDefault={handleCreate}
          class="mt-2 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
          disabled={saving}
        >
          {saving ? 'Publishing...' : 'Publish'}
        </button>
      </div>

      <!-- List of existing news -->
      <div class="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
        <h2 class="text-sm font-semibold text-slate-200">Recent posts</h2>

        {#if news.length === 0}
          <p class="text-sm text-slate-400">No news items yet.</p>
        {:else}
          <ul class="space-y-2 text-sm">
            {#each news as item}
              <li class="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1">
                <div class="flex justify-between items-center gap-2">
                  <div>
                    <p class="font-semibold text-slate-100">{item.title}</p>
                    <p class="text-xs text-slate-500">
                      {item.category} • {formatDate(item.createdAt)}
                    </p>
                  </div>
                  <button
                    class="text-[11px] px-2 py-1 rounded-lg border border-slate-700 hover:bg-slate-800"
                    on:click|preventDefault={() => togglePin(item)}
                  >
                    {item.pinToBanner ? 'Unpin' : 'Pin'}
                  </button>
                </div>
                {#if item.body}
                  <p class="text-xs text-slate-400">
                    {item.body.length > 120 ? item.body.slice(0, 120) + '…' : item.body}
                  </p>
                {/if}
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  {/if}
</div>
