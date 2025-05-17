import {atom} from "jotai";
import type {components} from "@/schema.ts";

export const $userId = atom<string | null>(null)

export const $repoId = atom<string | null>(null)

export const $fileId = atom<string | null>(null)

export type ApiCommitModel = components['schemas']['CommitDto']

export type ApiRepositoryModel = components['schemas']['RepositoryDto']

export type ApiRepositoryViewModel = components['schemas']['RepositoryViewDto']

export type ApiCommitFileModel = components['schemas']['CommitFileDto']
