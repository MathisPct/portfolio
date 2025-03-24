import { defineCollection, z } from 'astro:content';
import { getProjectsList, GitHubProjectSchema } from '../services/projects-github';

const blog = defineCollection({
	schema: GitHubProjectSchema,
	loader: () => getProjectsList()
});

export const collections = { blog };
