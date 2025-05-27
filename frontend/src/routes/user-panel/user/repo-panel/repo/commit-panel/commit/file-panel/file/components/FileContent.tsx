import React, {useMemo} from "react";
import type {ApiFileContentModel} from "@/store/store.ts";
import hljs from "highlight.js";

function FileContent(
    {
        fileContent
    }: {
        fileContent: ApiFileContentModel
    }
) {
    const highlightedCode = useMemo(() => {
        if (!fileContent.isBinary) {
            const extension = fileContent.commitFile!.name!.includes('.')
                ? fileContent.commitFile!.name!.substring(fileContent.commitFile!.name!.lastIndexOf('.') + 1).toLowerCase()
                : null

            const hasLang = extension && hljs.listLanguages().includes(extension)

            return hasLang
                ? hljs.highlight(extension, fileContent.content!).value
                : hljs.highlightAuto(fileContent.content!).value
        }
        return null
    }, [fileContent])

    return (
        <pre className="whitespace-pre-wrap text-sm">
            <code>
                <div className="grid grid-cols-[auto_1fr] gap-1 text-xs">
                    {
                        !fileContent.isBinary
                            ? highlightedCode && highlightedCode.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                            <span
                                className="text-gray-500 text-right pr-4 font-mono select-none">
                                {index + 1}
                            </span>
                                <span dangerouslySetInnerHTML={{__html: line}}/>
                            </React.Fragment>
                        ))
                            : <span>Бинарный файл</span>
                    }
                </div>
            </code>
        </pre>
    )
}

export default FileContent
