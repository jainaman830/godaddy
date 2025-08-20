import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import RepoList from './components/RepoList';
import RepoDetails from './components/RepoDetails';
import './index.css';

const App: React.FC = () => (
  <Router>
    <div className="app-header">
      <span className="logo">🚀</span>
      GoDaddy GitHub Repositories
    </div>
    <div className="app-container">
      {<Switch>
        <Route exact path="/" component={RepoList} />
        <Route path="/repos/:id" component={RepoDetails} />
      </Switch>}
    </div>
<div className="app-footer">
  © {new Date().getFullYear()} GoDaddy Repos Viewer &mdash; Powered by GitHub API
</div>
  </Router>
);

export default App;