import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {useNavigate} from "react-router-dom";

interface repoProps {
    id: number,
    name: string,
    created_at: string,
    visibility: string,

}

function RepoCard({id, name, created_at, visibility}: repoProps) {
    const nav = useNavigate();

    return (
        <div className={"transition-transform hover:scale-102 hover:cursor-pointer"}
             onClick={() => {
                 nav(`repo/${name}`);
             }}
        >
            <Card>
                <CardContent>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>
                                <div className="flex items-center justify-between gap-2">
                                    <Label>{name}</Label>
                                    <Badge>{visibility}</Badge>
                                </div>
                            </CardTitle>
                            <CardDescription>{created_at}</CardDescription>
                        </div>
                        <div>
                            <Button>
                                Редактировать
                            </Button>
                        </div>

                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default RepoCard;