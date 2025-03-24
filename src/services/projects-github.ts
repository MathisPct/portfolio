import { GITHUB_TOKEN } from './const';
import { z } from 'astro:content';

const GITHUB_USERNAME = 'MathisPct'
const headers = new Headers()
headers.set('Authorization', `Bearer ${import.meta.env.GH_TOKEN}`)

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
  pubDate: z.date()
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

    export async function getProjectsList(): Promise<GitHubProjectSchema[]> {

    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`, { headers });
    const repos = await response.json();

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