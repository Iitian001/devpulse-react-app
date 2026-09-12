import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import RepoCard from '../components/RepoCard';
import { useDebounce } from '../hooks/useDebounce';
import { PinboardContext } from '../context/PinboardContext';

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialUser = searchParams.get('user') || '';
  const initialLang = searchParams.get('lang') ? searchParams.get('lang').split(',') : [];
  const initialSort = searchParams.get('sort') || 'Updated';

  const [usernameInput, setUsernameInput] = useState(initialUser);
  const [languageFilter, setLanguageFilter] = useState(initialLang);
  const [sortMethod, setSortMethod] = useState(initialSort);

  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);

  const debouncedUsername = useDebounce(usernameInput, 500);

  const { state, dispatch } = useContext(PinboardContext);

  useEffect(() => {
    // Update URL when filters/sort change
    const newParams = new URLSearchParams();
    if (debouncedUsername) newParams.set('user', debouncedUsername);
    if (languageFilter.length > 0) newParams.set('lang', languageFilter.join(','));
    if (sortMethod !== 'Updated') newParams.set('sort', sortMethod);
    setSearchParams(newParams);
  }, [debouncedUsername, languageFilter, sortMethod, setSearchParams]);

  useEffect(() => {
    document.title = debouncedUsername ? `${debouncedUsername} | DevPulse` : 'DevPulse';

    if (!debouncedUsername) {
      setProfile(null);
      setRepos([]);
      setHasError(null);
      return;
    }

    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      setHasError(null);
      
      const headers = {};
      const token = import.meta.env.VITE_API_TOKEN;
      if (token) {
        headers['Authorization'] = `token ${token}`;
      }

      try {
        const [profileRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${debouncedUsername}`, { headers }),
          fetch(`https://api.github.com/users/${debouncedUsername}/repos?per_page=100&sort=updated`, { headers })
        ]);

        if (!profileRes.ok) throw new Error('User not found or API rate limit exceeded');
        
        const profileData = await profileRes.json();
        const reposData = await reposRes.json();

        if (isMounted) {
          setProfile(profileData);
          setRepos(reposData);
        }
      } catch (err) {
        if (isMounted) {
          setHasError(err.message);
          setProfile(null);
          setRepos([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [debouncedUsername]);

  const languages = useMemo(() => {
    const langs = new Set(repos.map(r => r.language).filter(Boolean));
    return Array.from(langs);
  }, [repos]);

  const filteredAndSortedRepos = useMemo(() => {
    let result = repos;

    if (languageFilter.length > 0) {
      result = result.filter(r => r.language && languageFilter.includes(r.language));
    }

    result = [...result].sort((a, b) => {
      if (sortMethod === 'Stars') {
        return b.stargazers_count - a.stargazers_count;
      } else if (sortMethod === 'Forks') {
        return b.forks_count - a.forks_count;
      } else {
        // default to recently updated
        return new Date(b.updated_at) - new Date(a.updated_at);
      }
    });

    return result;
  }, [repos, languageFilter, sortMethod]);

  const handleTogglePin = useCallback((repo, isPinned) => {
    if (isPinned) {
      dispatch({ type: 'UNPIN_REPO', payload: repo.id });
    } else {
      dispatch({ type: 'PIN_REPO', payload: repo });
    }
  }, [dispatch]);

  return (
    <div className="container">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: 'var(--accent-color)' }}>DevPulse</h1>
        <p className="repo-desc">GitHub Inspector</p>
        
        <input
          type="text"
          className="input-field"
          style={{ width: '100%', maxWidth: '400px' }}
          placeholder="Search GitHub Username..."
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
        />
      </div>

      {isLoading && <p>Loading data...</p>}
      {hasError && <p style={{ color: 'red' }}>Error: {hasError}</p>}

      {!isLoading && !hasError && profile && (
        <>
          <div className="profile-header">
            <img src={profile.avatar_url} alt={`${profile.login} avatar`} className="avatar" />
            <div>
              <h2>{profile.name || profile.login}</h2>
              <p className="repo-desc">{profile.bio}</p>
              <div className="repo-meta">
                <span>Followers: {profile.followers}</span>
                <span>Following: {profile.following}</span>
                <span>Public Repos: {profile.public_repos}</span>
              </div>
            </div>
          </div>

          <div className="filters-bar items-center justify-between">
            <div className="flex gap-4 items-center">
              <label className="flex items-center">
                <span style={{ marginRight: '8px' }}>Language:</span>
                <select 
                  multiple
                  className="input-field" 
                  style={{ height: '80px', padding: '4px' }}
                  value={languageFilter} 
                  onChange={(e) => {
                    const options = Array.from(e.target.options);
                    setLanguageFilter(options.filter(o => o.selected).map(o => o.value));
                  }}
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </label>
              
              <label>
                Sort By: 
                <select 
                  className="input-field" 
                  style={{ marginLeft: '8px' }}
                  value={sortMethod} 
                  onChange={(e) => setSortMethod(e.target.value)}
                >
                  <option value="Updated">Recently Updated</option>
                  <option value="Stars">Most Stars</option>
                  <option value="Forks">Most Forks</option>
                </select>
              </label>
            </div>
            
            <p className="repo-desc" style={{ marginBottom: 0 }}>Showing {filteredAndSortedRepos.length} repositories</p>
          </div>

          <div className="grid">
            {filteredAndSortedRepos.map(repo => (
              <RepoCard
                key={repo.id}
                repo={repo}
                isPinned={state.pinnedRepos.some(r => r.id === repo.id)}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
