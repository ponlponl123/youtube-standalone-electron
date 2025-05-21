import { Button, Link } from "@heroui/react"
import { GitFork, GitPullRequest } from "@phosphor-icons/react"

function Equalizer() {

    return (
        <div className="p-2 text-center max-w-48">
            <h1 className="font-bold">❤️</h1>
            <h4 className="font-semibold">This feature currently unavaliable</h4>
            <p className="text-xs opacity-40">If you have a idea to make this Equalizer works, Feel free to make your PR!</p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                <Link href="https://github.com/ponlponl123/youtube-standalone-electron/compare" target="_blank">
                    <Button size="sm"><GitPullRequest/> Make Pull Request</Button>
                </Link>
                <Link href="https://github.com/ponlponl123/youtube-standalone-electron/fork" target="_blank">
                    <Button size="sm"><GitFork /> Fork Repository</Button>
                </Link>
            </div>
        </div>
    )
}

export default Equalizer