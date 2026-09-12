import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { PinboardContext } from './context/PinboardContext';

function App() {
  const { state, dispatch } = useContext(PinboardContext);

  const handleUnpin = (id) => {
    dispatch({ type: 'UNPIN_REPO', payload: id });
  };

  return (
    <div className="layout">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inspect" element={<Dashboard />} />
        </Routes>
      </main>
      
      <aside className="sidebar">
        <h2>Pinboard</h2>
        <p className="repo-desc">Saved repositories for quick access.</p>
        
        {state.pinnedRepos.length === 0 ? (
          <p className="repo-desc">No repositories pinned yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {state.pinnedRepos.map(repo => (
              <div key={repo.id} className="card" style={{ marginBottom: 0 }}>
                <div className="flex justify-between items-center">
                  <a href={repo.html_url} target="_blank" rel="noreferrer" className="repo-title" style={{ fontSize: '14px' }}>
                    {repo.name}
                  </a>
                  <button onClick={() => handleUnpin(repo.id)} className="btn" style={{ padding: '4px 8px', fontSize: '12px' }}>
                    Unpin
                  </button>
                </div>
                {repo.description && (
                  <p className="repo-desc" style={{ fontSize: '12px', marginTop: '4px', marginBottom: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {repo.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}

export default App;
