import { Button, Link } from "@heroui/react"
import { GitFork, GitPullRequest } from "@phosphor-icons/react"
import { useLanguage } from "../contexts/langContext";

function Equalizer() {
    const { language } = useLanguage();
    return (
        <div className="p-2 text-center max-w-48">
            <h1 className="font-bold">❤️</h1>
            <h4 className="font-semibold">{language.data.app.tools.equalizer.title}</h4>
            <p className="text-xs opacity-40">{language.data.app.tools.equalizer.description}</p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                <Link href="https://github.com/ponlponl123/youtube-standalone-electron/compare" target="_blank">
                    <Button size="sm"><GitPullRequest/> {language.data.app.tools.equalizer.actions.pr}</Button>
                </Link>
                <Link href="https://github.com/ponlponl123/youtube-standalone-electron/fork" target="_blank">
                    <Button size="sm"><GitFork /> {language.data.app.tools.equalizer.actions.fork}</Button>
                </Link>
            </div>
        </div>
    )
}

export default Equalizer