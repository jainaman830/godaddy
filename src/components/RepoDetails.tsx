import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchRepos } from '../api/github';
import { Repo } from '../types';

const RepoDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [repo, setRepo] = useState<Repo | null | undefined>(undefined);

  useEffect(() => {
    fetchRepos().then(repos => {
      const found = repos.find(r => r.id === Number(id));
      setRepo(found ?? null);
    });
  }, [id]);

  if (repo === undefined) return <div>Loading...</div>;
  if (repo === null) return <div>Repository not found.</div>;

  return (
    <div className="details-container">
      <Link to="/" className="back-link">← Back to list</Link>
      <h2>{repo.name}</h2>
      <p className="repo-desc">{repo.description}</p>
      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
        View on GitHub ↗
      </a>
      <div className="details-meta">
        <div><strong>Language:</strong> {repo.language || 'N/A'}</div>
        <div><strong>Forks:</strong> {repo.forks_count}</div>
        <div><strong>Open Issues:</strong> {repo.open_issues_count}</div>
        <div><strong>Watchers:</strong> {repo.watchers_count}</div>
      </div>
    </div>
  );
};

export default RepoDetails;