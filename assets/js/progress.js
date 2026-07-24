/* ============================================================
   Progress engine — XP, streaks, badges, unlock state.
   Persisted to localStorage; per-device by design (no backend).
   ============================================================ */

const Progress = (() => {
  const STORAGE_KEY = "booklet_progress_v1";
  const DAY_MS = 24 * 60 * 60 * 1000;

  function todayStr(d = new Date()) {
    return d.toISOString().slice(0, 10);
  }

  function load() {
    let raw;
    try {
      raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      raw = null;
    }
    const state = Object.assign(
      {
        xp: 0,
        streak: 0,
        lastActiveDate: null,
        completed: {}, // { "p1-c3": true }
        badges: {}, // { "badge-id": true }
      },
      raw || {}
    );
    return state;
  }

  function save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  let state = load();

  function touchStreak() {
    const today = todayStr();
    if (state.lastActiveDate === today) return { changed: false, streak: state.streak };
    const prev = state.lastActiveDate ? new Date(state.lastActiveDate).getTime() : null;
    const now = new Date(today).getTime();
    if (prev !== null && now - prev <= DAY_MS) {
      state.streak += 1;
    } else {
      state.streak = 1;
    }
    state.lastActiveDate = today;
    save(state);
    return { changed: true, streak: state.streak };
  }

  function xpForLevel(level) {
    // level N requires N * 120 cumulative XP (gentle ramp)
    return level * 120;
  }

  function levelFromXp(xp) {
    let level = 1;
    while (xp >= xpForLevel(level)) level += 1;
    return level;
  }

  function levelProgress(xp) {
    const level = levelFromXp(xp);
    const floor = level === 1 ? 0 : xpForLevel(level - 1);
    const ceil = xpForLevel(level);
    const pct = Math.min(100, Math.round(((xp - floor) / (ceil - floor)) * 100));
    return { level, floor, ceil, pct };
  }

  function isCompleted(chapterId) {
    return !!state.completed[chapterId];
  }

  function isUnlocked(chapterId, chapterMap) {
    const ch = chapterMap[chapterId];
    if (!ch) return false;
    if (!ch.requires || ch.requires.length === 0) return true;
    return ch.requires.every((r) => isCompleted(r));
  }

  function completeChapter(chapterId, xpAward) {
    const already = isCompleted(chapterId);
    if (!already) {
      state.completed[chapterId] = true;
      state.xp += xpAward;
    }
    save(state);
    const streakInfo = touchStreak();
    return { alreadyCompleted: already, xp: state.xp, streak: streakInfo.streak };
  }

  function awardBadge(badgeId) {
    if (state.badges[badgeId]) return false;
    state.badges[badgeId] = true;
    save(state);
    return true;
  }

  function hasBadge(badgeId) {
    return !!state.badges[badgeId];
  }

  function getState() {
    return JSON.parse(JSON.stringify(state));
  }

  function partCompletion(chapterIds) {
    const done = chapterIds.filter(isCompleted).length;
    return { done, total: chapterIds.length, pct: Math.round((done / chapterIds.length) * 100) };
  }

  return {
    load,
    touchStreak,
    isCompleted,
    isUnlocked,
    completeChapter,
    awardBadge,
    hasBadge,
    getState,
    levelFromXp,
    levelProgress,
    partCompletion,
  };
})();
