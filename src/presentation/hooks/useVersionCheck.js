import { useState, useEffect } from 'react';

const CACHE_KEY = 'crossview_version_check_v2';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function parseSemver(version) {
  const normalized = String(version || '').trim().replace(/^v/, '').split('+')[0];
  const dashIndex = normalized.indexOf('-');
  const core = dashIndex >= 0 ? normalized.slice(0, dashIndex) : normalized;
  const prereleaseRaw = dashIndex >= 0 ? normalized.slice(dashIndex + 1) : '';

  const coreParts = core.split('.').map(p => parseInt(p, 10));
  const prerelease = prereleaseRaw
    ? prereleaseRaw.split('.').map(part => (/^\d+$/.test(part) ? parseInt(part, 10) : part.toLowerCase()))
    : [];

  return {
    major: coreParts[0] || 0,
    minor: coreParts[1] || 0,
    patch: coreParts[2] || 0,
    prerelease,
  };
}

function comparePrereleaseIdentifier(a, b) {
  const aIsNumber = typeof a === 'number';
  const bIsNumber = typeof b === 'number';

  if (aIsNumber && bIsNumber) {
    return a === b ? 0 : (a > b ? 1 : -1);
  }

  if (aIsNumber && !bIsNumber) return -1;
  if (!aIsNumber && bIsNumber) return 1;

  if (a === b) return 0;
  return String(a).localeCompare(String(b));
}

function compareSemver(a, b) {
  if (a.major !== b.major) return a.major > b.major ? 1 : -1;
  if (a.minor !== b.minor) return a.minor > b.minor ? 1 : -1;
  if (a.patch !== b.patch) return a.patch > b.patch ? 1 : -1;

  const aPre = a.prerelease;
  const bPre = b.prerelease;

  if (aPre.length === 0 && bPre.length === 0) return 0;
  if (aPre.length === 0) return 1;
  if (bPre.length === 0) return -1;

  const max = Math.max(aPre.length, bPre.length);
  for (let i = 0; i < max; i += 1) {
    if (i >= aPre.length) return -1;
    if (i >= bPre.length) return 1;

    const cmp = comparePrereleaseIdentifier(aPre[i], bPre[i]);
    if (cmp !== 0) return cmp;
  }

  return 0;
}

function isNewer(candidate, current) {
  return compareSemver(parseSemver(candidate), parseSemver(current)) > 0;
}

export const useVersionCheck = (currentVersion) => {
  const [updateInfo, setUpdateInfo] = useState(null);

  useEffect(() => {
    if (!currentVersion) return;
    setUpdateInfo(null);

    const check = async () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { timestamp, data } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL_MS) {
            if (data && isNewer(data.latestVersion, currentVersion)) {
              setUpdateInfo(data);
            }
            return;
          }
        }

        const res = await fetch(
          'https://api.github.com/repos/corpobit/crossview/releases?per_page=100',
          { headers: { Accept: 'application/vnd.github+json' } }
        );
        if (!res.ok) return;

        const releases = await res.json();
        const candidates = releases.filter(r => !r.draft && r.tag_name);
        if (candidates.length === 0) return;

        const latest = candidates.reduce((best, current) => {
          const bestVersion = best.tag_name.replace(/^v/, '');
          const currentVersionTag = current.tag_name.replace(/^v/, '');
          return compareSemver(parseSemver(currentVersionTag), parseSemver(bestVersion)) > 0 ? current : best;
        });

        const data = {
          latestVersion: latest.tag_name.replace(/^v/, ''),
          releaseUrl: latest.html_url,
          isPrerelease: latest.prerelease,
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));

        if (isNewer(data.latestVersion, currentVersion)) {
          setUpdateInfo(data);
        }
      } catch {}
    };

    check();
  }, [currentVersion]);

  return updateInfo;
};
