import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {
    ArrowBigLeftDash,
    ArrowBigRightDash,
    ArrowLeft,
    ArrowRight,
    BoxIcon,
    FilterIcon,
    SearchIcon,
    SettingsIcon
} from "lucide-react";
import RepoCard from "@/routes/user-panel/user/RepoCard.tsx";
import {useState} from "react";

function RepoList () {
    const reposArr = {
        repos: [
            // Пример 30 репозиториев
            ...Array.from({ length: 30 }, (_, i) => ({
                id: i + 1,
                name: `repo${i + 1}`,
                created_at: new Date().toLocaleDateString(),
                visibility: i % 2 === 0 ? "public" : "private",
            })),
        ],
    };

    const [page, setPage] = useState(1);
    const reposPerPage = 10;

    const totalPages = Math.ceil(reposArr.repos.length / reposPerPage);

    const paginatedRepos = reposArr.repos.slice(
        (page - 1) * reposPerPage,
        page * reposPerPage
    );

    const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));
    const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
    const handleDashLeft = () => setPage(() => {
        return 1
    });
    const handleDashRight = () => setPage(() => {
        return totalPages
    });


    return (
        <div className="flex flex-col gap-2">
            <div className={"flex justify-between gap-1"}>
                <Label className={"text-xl font-bold"}>Репозитории</Label>
                <Button className={"ml-auto"}>
                    <SettingsIcon/> Настройки
                </Button>
            </div>
            <div className={"flex justify-between"}>
                <div className={"flex items-center gap-1"}>
                    <SearchIcon/>
                    <Input
                        placeholder={""}
                        onChange={(event) => {}}
                        className="max-w-sm"
                    />
                    <Button>
                        <FilterIcon/>
                    </Button>
                </div>
                <div className={"flex items-center gap-1 ml-auto"}>
                    <Button>
                        <BoxIcon/> Добавить в репозиторий
                    </Button>
                </div>
            </div>

            {paginatedRepos.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {paginatedRepos.map((repo) => (
                        <RepoCard
                            key={repo.id}
                            id={repo.id}
                            name={repo.name}
                            created_at={repo.created_at}
                            visibility={repo.visibility}
                        />
                    ))}
                </div>
            ) : (
                <Label className="text-xl font-bold">Грустно 😢</Label>
            )}

            <div className="flex items-center justify-center gap-4 mt-4">
                <Button onClick={handleDashLeft} disabled={page === 1} variant="outline">
                    <ArrowBigLeftDash/>
                </Button>
                <Button onClick={handlePrev} disabled={page === 1} variant="outline">
                    <ArrowLeft/>
                </Button>
                <span className="text-muted-foreground">Страница {page} из {totalPages}</span>
                <Button onClick={handleNext} disabled={page === totalPages} variant="outline">
                    <ArrowRight/>
                </Button>
                <Button onClick={handleDashRight} disabled={page === totalPages} variant="outline">
                    <ArrowBigRightDash/>
                </Button>
            </div>

        </div>
    )
}

export default RepoList;