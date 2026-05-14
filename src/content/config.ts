import { defineCollection } from 'astro:content';

const journalCollection = defineCollection({
  type: 'content',
});

const guidesCollection = defineCollection({
  type: 'content',
});

const bucketlistCollection = defineCollection({
  type: 'content',
});

export const collections = {
  journal: journalCollection,
  guides: guidesCollection,
  bucketlist: bucketlistCollection,
};
