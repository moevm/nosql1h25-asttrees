
import RichTableView from "@/components/custom/table/RichTableView.tsx";
import {columnsFiles} from "@/columns/columnsFiles.tsx";
import { faker } from "@faker-js/faker";

export interface tempFile {
    hash: string,
    name: string,
    size: string,
    countStrings: number,
    createdAt: string,
    type: string,
    commitName: string,
    repoName: string,
    author: string,
    changedAuthor: string
}

export function generateMockFiles(count = 20): tempFile[] {
    const types = ['FILE', 'DIRECTORY'];

    return Array.from({ length: count }, (_, index) => ({
        hash: faker.string.alphanumeric(40),
        name: faker.system.fileName(),
        size: `${faker.number.int({ min: 100, max: 10_000 })} KB`,
        countStrings: faker.number.int({ min: 10, max: 1000 }),
        createdAt: faker.date.recent().toISOString(),
        type: faker.helpers.arrayElement(types),
        commitName: `commit-${faker.git.commitSha().slice(0, 7)}`,
        repoName: "repo",
        author: faker.internet.userName(),
        changedAuthor: faker.internet.userName(),
    }));
}

function AdminFilesTableView(props: {
    data: tempFile[]
}) {
    return (
        <>
            <>
                <RichTableView
                    entries={props.data}
                    tableConfig={{
                        columns: columnsFiles
                    }}
                    settings={{
                        enableSearch: true,
                        enableVisualization: true,
                        enableColumnVisibilityToggle: true,
                        rowClickHandler: (user) => {
                            // navigate(`/spaces/${selectedSpaceId}/dashboard/users/${user._id}`)
                        }
                    }}
                />
            </>
        </>
    )
}

export default AdminFilesTableView