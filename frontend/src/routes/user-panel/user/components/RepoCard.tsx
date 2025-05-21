import {Card, CardContent, CardDescription, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {useNavigate} from "react-router-dom";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import UserRepoSettingsDialog from "@/components/dialogs/UserRepoSettingsDialog.tsx";
import type {ApiRepositoryModel} from "@/store/store.ts";
import {useAtomValue, useSetAtom} from "jotai/react";
import {$currentRepo, showRepoSettingsDialogAtom} from "@/store/store.ts";

const formatDate = (isoDateString: string | undefined): string => {
    if (!isoDateString) {
        return "Дата неизвестна";
    }
    try {
        const date = new Date(isoDateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `Создан ${day}.${month}.${year} ${hours}:${minutes}`;
    } catch (error) {
        console.error("Ошибка форматирования даты:", error);
        return "Неверный формат даты";
    }
};

function RepoCard({repo}: { repo: ApiRepositoryModel }) {
    const nav = useNavigate();

    const showRepoSettingsDialog = useAtomValue(showRepoSettingsDialogAtom);
    const setShowRepoSettingsDialog = useSetAtom(showRepoSettingsDialogAtom);


    return (
        <Card
            className="cursor-pointer"
            onClick={(e) => {
                if (showRepoSettingsDialog) {
                    return;
                }
                nav(`repo/${repo.id}/branch/default/commit/latest`);
            }}
        >
            <CardContent>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>
                            <div className="flex items-center justify-between gap-2">
                                <Label>{repo.name}</Label>
                                <Badge>
                                    {repo.visibility === 'PRIVATE' ? 'Приватный' : repo.visibility === 'PUBLIC' ? 'Публичный' : repo.visibility}
                                </Badge>
                            </div>
                        </CardTitle>

                        <CardDescription className="mt-4">{formatDate(repo.createdAt)}</CardDescription>
                    </div>
                    <div>
                        <Dialog open={showRepoSettingsDialog} onOpenChange={setShowRepoSettingsDialog}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    className="hover:cursor-pointer"
                                >
                                    Редактировать
                                </Button>
                            </DialogTrigger>
                            <UserRepoSettingsDialog repo={repo}/>
                        </Dialog>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default RepoCard;