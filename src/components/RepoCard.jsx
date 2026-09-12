import React, { memo } from 'react';

const RepoCard = memo(({ repo, isPinned, onTogglePin }) => {
  return (
    <div className="card repo-card">
      <div>
        <div className="repo-header">
          <a href={repo.html_url} target="_blank" rel="noreferrer" className="repo-title">
            {repo.name}
          </a>
          <button 
            className={`btn ${isPinned ? 'btn-primary' : ''}`} 
            onClick={() => onTogglePin(repo, isPinned)}
          >
            {isPinned ? 'Unpin' : 'Pin'}
          </button>
        </div>
        <p className="repo-desc">{repo.description || 'No description provided.'}</p>
      </div>
      <div className="repo-meta">
        {repo.language && <span>{repo.language}</span>}
        <span>★ {repo.stargazers_count}</span>
        <span>⑂ {repo.forks_count}</span>
        <span>Updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
});

export default RepoCard;
