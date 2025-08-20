import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import RepoDetails from '../components/RepoDetails';
import * as api from '../api/github';


jest.mock('../api/github', () => ({
  fetchRepos: jest.fn(),
}));

const mockRepo = {
  id: 1,
  name: 'example-repo',
  description: 'This is an example repository',
  html_url: 'https://github.com/godaddy/example-repo',
  language: 'JavaScript',
  forks_count: 10,
  open_issues_count: 2,
  watchers_count: 5,
};

describe('RepoDetails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders repository details correctly', async () => {
    (api.fetchRepos as jest.Mock).mockResolvedValue([mockRepo]);
    render(
      <MemoryRouter initialEntries={['/repos/1']}>
        <Route path="/repos/:id">
          <RepoDetails />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(mockRepo.name)).toBeInTheDocument();
      expect(screen.getByText(mockRepo.description)).toBeInTheDocument();
      expect(screen.getByText(/language:/i)).toBeInTheDocument();
      expect(screen.getByText(/forks:/i)).toBeInTheDocument();
      expect(screen.getByText(/open issues:/i)).toBeInTheDocument();
      expect(screen.getByText(/watchers:/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /view on github/i })).toHaveAttribute('href', mockRepo.html_url);
    });
  });

  test('shows loading state while fetching', () => {
    // fetchRepos returns a pending promise, so loading should show
    (api.fetchRepos as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(
      <MemoryRouter initialEntries={['/repos/999']}>
        <Route path="/repos/:id">
          <RepoDetails />
        </Route>
      </MemoryRouter>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('shows not found state if repo is not loaded', async () => {
  (api.fetchRepos as jest.Mock).mockResolvedValue([]);
  render(
    <MemoryRouter initialEntries={['/repos/999']}>
      <Route path="/repos/:id">
        <RepoDetails />
      </Route>
    </MemoryRouter>
  );
  expect(await screen.findByText(/repository not found/i)).toBeInTheDocument();
});
});