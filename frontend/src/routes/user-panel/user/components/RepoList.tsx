import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {
    ArrowBigLeftDash,
    ArrowBigRightDash,
    ArrowLeft,
    ArrowRight,
    FilterIcon, SearchIcon
} from "lucide-react";
import RepoCard from "@/routes/user-panel/user/components/RepoCard.tsx";
import {useMemo, useState} from "react";
import UserSettingsDialog from "@/components/dialogs/UserSettingsDialog.tsx";
import UserAddRepoDialog from "@/components/dialogs/UserAddRepoDialog.tsx";
import type {ApiRepositoryModel} from "@/store/store.ts";

function RepoList({data}: { data: ApiRepositoryModel[] }) {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const reposPerPage = 10;

    const filteredRepos = useMemo(() => {
        return data.filter((repo) =>
            repo.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, data]);

    const totalPages = Math.ceil(filteredRepos.length / reposPerPage);

    const paginatedRepos = filteredRepos.slice(
        (page - 1) * reposPerPage,
        page * reposPerPage
    );

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setPage(1);
    };

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
                <div className={"ml-auto flex justify-center"}>
                    <UserSettingsDialog/>
                </div>
            </div>
            <div className={"flex justify-between"}>
                <div className={"flex items-center gap-1"}>
                    <SearchIcon/>
                    <Input
                        placeholder={""}
                        onChange={handleSearch}
                        className="max-w-sm"
                    />
                    <Button>
                        <FilterIcon/>
                    </Button>
                </div>
                <div className={"flex items-center gap-1 ml-auto"}>
                    <UserAddRepoDialog/>
                </div>
            </div>

            {paginatedRepos.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {paginatedRepos.map((repo) => (
                        <RepoCard repo={repo}
                        />
                    ))}
                </div>
            ) : (
                <Label className="text-lg font-medium text-gray-600">Отсутствуют репозитории</Label>
            )}

            {paginatedRepos.length > 0 ? (
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

            ) : (
                <></>
            )}
        </div>
    )
}

export default RepoList;