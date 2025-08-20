export interface Repo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    language: string | null;
    forks_count: number;
    open_issues_count: number;
    watchers_count: number;
}