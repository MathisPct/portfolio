import { GITHUB_TOKEN } from './const';
import { z } from 'astro:content';

const GITHUB_USERNAME = 'MathisPct'
const headers = new Headers()
headers.set('Authorization', `Bearer ${GITHUB_TOKEN}`)

export const LinkSchema = z.object({
    title: z.string(),
    href: z.string(),
    icon: z.string(),
})
export type LinkSchema = z.infer<typeof LinkSchema>

export const GitHubProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    url: z.string(),
    readme: z.string().nullable(),
    thumbnail: z.string().nullable(),
    pubDate: z.date(),
    links: z.array(LinkSchema).nullable(),
    language: z.string().nullable(),
    tags: z.array(z.string()).nullable(),
})
export type GitHubProjectSchema = z.infer<typeof GitHubProjectSchema>


function replaceImageSrc(domainPrefix: string, path: string): string {
    if (
        path.startsWith('http://') ||
        path.startsWith('https://') ||
        path.startsWith('//') ||
        path.startsWith('data:')
    ) {
        return path;
    }

    return domainPrefix + (path.startsWith('/') ? path.slice(1) : path);
}

async function getAllRepos(username, headers) {
  const repos = [];
  for (let page = 1; ; page++) {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&page=${page}`,
      { headers }
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
    const batch = await res.json();
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos;
}

export async function getProjectsList(): Promise<GitHubProjectSchema[]> {
    const repos = await getAllRepos(GITHUB_USERNAME, headers);    
    const projects: GitHubProjectSchema[] = [];

    for (const repo of repos) {
        if (!repo.topics.includes('portfolio')) {
            continue;
        }

        const domainPrefix = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/${repo.default_branch}/`;

        const project = GitHubProjectSchema.parse({
            id: repo.id.toString(),
            title: repo.name,
            name: repo.name,
            url: repo.html_url,
            thumbnail: `${domainPrefix}thumbnail.png`,
            description: repo.description,
            readme: null,
            pubDate: new Date(repo.created_at),
            links: [{ href: repo.html_url, icon: 'logo-github', title: 'GitHub' }],
            language: repo.language,
            tags: repo.topics.filter((topic: string) => topic !== 'portfolio'),
        });

        const readmeResponse = await fetch(
            `${domainPrefix}README.md`,
            { headers },
        );
        let readme = await readmeResponse.text();

        readme = readme.replace(/src="([^"]+)"/g, (match, src) => {
            const newSrc = replaceImageSrc(domainPrefix, src);
            return `src="${newSrc}"`;
        });

        readme = readme.replace(/href="([^"]+)"/g, (match, href) => {
            const newHref = replaceImageSrc(domainPrefix, href);
            return `href="${newHref}"`;
        });

        readme = readme.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
            const newUrl = replaceImageSrc(domainPrefix, url);
            return `[${text}](${newUrl})`;
        });

        readme = readme.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
            const newUrl = replaceImageSrc(domainPrefix, url);
            return `![${alt}](${newUrl})`;
        });

        project.readme = readme;
        projects.push(project);
    }

    return projects;
}
