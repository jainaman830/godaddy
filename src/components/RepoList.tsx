import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRepos } from '../api/github';
import { Repo } from '../types';

const PAGE_SIZE = 10;

const RepoList: React.FC = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
   const loadRepos = async () => {
    try {
      const data = await fetchRepos();
      setRepos(data);
    } catch (err) {
      setError("Failed to load repositories.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  loadRepos();
  }, []);

  const totalPages = Math.ceil(repos.length / PAGE_SIZE);
  const paginatedRepos = repos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <div>Loading repositories...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <ul className="repo-list">
        {paginatedRepos.map(repo => (
          <li key={repo.id}>
            <div className="repo-title">
              <Link to={`/repos/${repo.id}`}>{repo.name}</Link>
            </div>
            <div className="repo-desc">{repo.description}</div>
            <div className="repo-meta">
              <span>Language: {repo.language || 'N/A'}</span>
              <span>Forks: {repo.forks_count}</span>
              <span>Open Issues: {repo.open_issues_count}</span>
              <span>Watchers: {repo.watchers_count}</span>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" style={{marginLeft: 'auto'}}>GitHub ↗</a>
            </div>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          ← Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next →
        </button>
      </div>
    </>
  );
};

export default RepoList;