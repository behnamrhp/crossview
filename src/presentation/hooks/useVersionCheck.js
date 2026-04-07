import { useState, useEffect } from 'react';

const CACHE_KEY = 'crossview_version_check';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function parseSemver(version) {
  const parts = version.replace(/^v/, '').split('.').map(p => parseInt(p, 10));
  return { major: parts[0] || 0, minor: parts[1] || 0, patch: parts[2] || 0 };
}

function isNewer(candidate, current) {
  const c = parseSemver(candidate);
  const cur = parseSemver(current);
  if (c.major !== cur.major) return c.major > cur.major;
  if (c.minor !== cur.minor) return c.minor > cur.minor;
  return c.patch > cur.patch;
}

export const useVersionCheck = (currentVersion) => {
  const [updateInfo, setUpdateInfo] = useState(null);

  useEffect(() => {
    if (!currentVersion) return;

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
          'https://api.github.com/repos/corpobit/crossview/releases?per_page=20',
          { headers: { Accept: 'application/vnd.github+json' } }
        );
        if (!res.ok) return;

        const releases = await res.json();
        const latest = releases.find(r => !r.draft);
        if (!latest) return;

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
