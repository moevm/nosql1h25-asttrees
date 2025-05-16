export interface RepoFileProps {
    id: string;
    branch: string;
    hash: string;
    author: string;
    email: string;
    message: string;
    filesChanged: number;
    linesAdded: number;
    linesRemoved: number;
    createdAt: string;
    rootFiles: {
        Items: {
            id: string;
            name: string;
            type: "DIRECTORY" | "FILE";
            hash: string;
            commit: string;
            parent: string | null;
        };
    }[];
}