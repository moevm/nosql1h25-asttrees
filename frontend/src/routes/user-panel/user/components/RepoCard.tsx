import {Card, CardContent, CardDescription, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {useNavigate} from "react-router-dom";
import {$repoSettingsDialogRepo, type ApiRepositoryModel} from "@/store/store.ts";
import {$showRepoSettingsDialog} from "@/store/store.ts";
import {useSetAtom} from "jotai/react";
import {cn} from "@/lib/utils.ts";
import dayjs from "dayjs";

const formatDate = (isoDateString: string | undefined): string => {
    if (!isoDateString) {
        return "Дата неизвестна";
    }
    try {
        return `Создан ${dayjs(isoDateString).format('DD.MM.YYYY HH:mm:ss')}`;
    } catch (error) {
        console.error("Ошибка форматирования даты:", error);
        return "Неверный формат даты";
    }
};

function RepoCard({repo, canEdit}: { repo: ApiRepositoryModel, canEdit: boolean }) {
    const nav = useNavigate();
    const setShowRepoSettingsDialog = useSetAtom($showRepoSettingsDialog)
    const setSelectedRepo = useSetAtom($repoSettingsDialogRepo)

    return (
        <Card
            onClick={(e) => {
                console.info((e.target as HTMLElement).tagName)
                if ((e.target as HTMLElement).tagName !== 'BUTTON') {
                    nav(`repo/${repo.id}/branch/default/commit/latest`, {replace: false});
                }
            }}
        >
            <CardContent>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>
                            <div className="flex items-center gap-2">
                                <Label>{repo.name}</Label>
                                <Badge className={cn({
                                    'bg-red-600': repo.visibility === 'PRIVATE',
                                    'bg-green-600': repo.visibility === 'PUBLIC',
                                    'bg-orange-600': repo.visibility === 'PROTECTED',
                                })}>
                                    {repo.visibility === 'PRIVATE' && 'Приватный'}
                                    {repo.visibility === 'PUBLIC' && 'Публичный'}
                                    {repo.visibility === 'PROTECTED' && 'Защищенный'}
                                </Badge>
                            </div>
                        </CardTitle>

                        <CardDescription className="mt-4">{formatDate(repo.createdAt)}</CardDescription>
                    </div>
                    {canEdit && <div>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setSelectedRepo(repo)
                                setShowRepoSettingsDialog(true)
                            }}
                        >
                            Редактировать
                        </Button>
                    </div>}
                </div>
            </CardContent>
        </Card>
    );
}

export default RepoCard;
