import {Card, CardContent, CardDescription, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {useNavigate} from "react-router-dom";
import {$repoSettingsDialogRepo, type ApiRepositoryModel} from "@/store/store.ts";
import {$showRepoSettingsDialog} from "@/store/store.ts";
import {useSetAtom} from "jotai/react";

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
    const setShowRepoSettingsDialog = useSetAtom($showRepoSettingsDialog)
    const setSelectedRepo = useSetAtom($repoSettingsDialogRepo)

    return (
        <Card
            onClick={(e) => {
                console.info((e.target as HTMLElement).tagName)
                if ((e.target as HTMLElement).tagName !== 'BUTTON') {
                    console.info('nav')
                    nav(`repo/${repo.id}/branch/default/commit/latest`, {replace: true});
                }
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
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setSelectedRepo(repo)
                                setShowRepoSettingsDialog(true)
                            }}
                        >
                            Редактировать
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default RepoCard;
