import {Card, CardContent, CardDescription, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {useNavigate} from "react-router-dom";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import UserRepoSettingsDialog from "@/components/dialogs/UserRepoSettingsDialog.tsx";
import {useRef} from "react";

//TODO заменить на ApiRepositoryModel, когда починим на бэке
export interface repoProps {
    id: number,
    name: string,
    owner: string,
    defaultBranch: string,
    originalLink: string,
    createdAt: string,
    visibility: string,
}

function RepoCard({repo}: { repo: repoProps }) {
    const nav = useNavigate();
    const ignoreClick = useRef(false);

    return (
        <div
            className="transition-transform hover:scale-102 hover:cursor-pointer"
            onClick={(e) => {
                if (ignoreClick.current) {
                    ignoreClick.current = false;
                    return;
                }
                nav(`repo/${repo.name}`);
            }}
        >
            <Card>
                <CardContent>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>
                                <div className="flex items-center justify-between gap-2">
                                    <Label>{repo.name}</Label>
                                    <Badge>{repo.visibility}</Badge>
                                </div>
                            </CardTitle>
                            <CardDescription>{repo.createdAt}</CardDescription>
                        </div>

                        <div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            ignoreClick.current = true;
                                        }}
                                    >
                                        Редактировать
                                    </Button>
                                </DialogTrigger>
                                <UserRepoSettingsDialog repo={repo} />
                            </Dialog>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default RepoCard;