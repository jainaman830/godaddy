import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import RepoList from '../components/RepoList';
import * as api from '../api/github';
import { BrowserRouter as Router } from 'react-router-dom';


jest.mock('../api/github', () => ({
  fetchRepos: jest.fn(),
}));

const mockRepos = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `repo${i + 1}`,
  description: `Description for repo${i + 1}`,
  html_url: `https://github.com/godaddy/repo${i + 1}`,
  language: i % 2 === 0 ? 'JavaScript' : 'Go',
  forks_count: 10 + i,
  open_issues_count: 2 + i,
  watchers_count: 5 + i,
}));

describe('RepoList', () => {
  beforeEach(() => {
    (api.fetchRepos as jest.Mock).mockResolvedValue(mockRepos);
  });

  test('renders a paginated list of repositories', async () => {
    render(
      <Router>
        <RepoList />
      </Router>
    );

    // Wait for repos to load
    await waitFor(() => {
      expect(screen.getByText('repo1')).toBeInTheDocument();
    });

    // Should show only PAGE_SIZE (10) repos on first page
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(`repo${i}`)).toBeInTheDocument();
    }
    expect(screen.queryByText('repo11')).not.toBeInTheDocument();

    // Go to next page
    fireEvent.click(screen.getByText(/next/i));
    await waitFor(() => {
      expect(screen.getByText('repo11')).toBeInTheDocument();
    });
    for (let i = 11; i <= 15; i++) {
      expect(screen.getByText(`repo${i}`)).toBeInTheDocument();
    }
    expect(screen.queryByText('repo1')).not.toBeInTheDocument();
  });

  test('shows error message on fetch failure', async () => {
    (api.fetchRepos as jest.Mock).mockRejectedValue(new Error('API error'));
    render(
      <Router>
        <RepoList />
      </Router>
    );
    await waitFor(() => {
      expect(screen.getByText(/failed to load repositories/i)).toBeInTheDocument();
    });
  });
});