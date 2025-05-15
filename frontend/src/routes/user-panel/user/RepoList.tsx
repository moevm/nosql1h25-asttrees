import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {BoxIcon, FilterIcon, SearchIcon, SettingsIcon} from "lucide-react";
import RepoCard from "@/routes/user-panel/user/RepoCard.tsx";

function RepoList () {
    const reposArr = {
        repos: [
            {
                id: 1,
                name: "repo1",
                created_at: new Date().getDate().toString(),
                visibility: "public",
            },
            {
                id: 2,
                name: "repo2",
                created_at: new Date().getDate().toString(),
                visibility: "public",
            },
            {
                id: 3,
                name: "repo3",
                created_at: new Date().getDate().toString(),
                visibility: "private",
            }
        ]
    }

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

            {reposArr ? (
                <div>
                    {reposArr.repos.map((repo) => (
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
                <div>

                </div>
            )}

        </div>
    )
}

export default RepoList;