<script lang="ts">
  const name = 'Lloyd';
  const currentWeight = 92.3;
  const startWeight = 95;
  const change = currentWeight - startWeight;

  const changeText =
    change < 0 ? `${Math.abs(change).toFixed(1)}kg down` : `${change.toFixed(1)}kg up`;

  const tip =
    'Take one 10-minute walk between lessons this week. Small wins add up.';
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
      <p class="text-3xl mt-2 font-bold">{currentWeight}kg</p>
      <p class="text-sm text-slate-400">Current logged weight</p>
      <p class="mt-4 text-sm text-emerald-400">{changeText}</p>
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
</div>
