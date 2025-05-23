import { Plugs } from '@phosphor-icons/react';
import { useApp } from '../contexts/appContext';
import { Button, Link } from '@heroui/react';
import { useLanguage } from '../contexts/langContext';

function Offline() {
    const { language } = useLanguage();
    const { version, showSetting } = useApp();
    return (
        <div className='absolute top-[2.4rem] left-0 w-full h-[calc(100%_-_2.4rem)] flex flex-col gap-4 items-center justify-center bg-(--background)/90 rounded-lg'>
            <Plugs size={48} />
            <h1 className='text-2xl'>{language.data.offline.title}</h1>
            <p>{language.data.offline.description.replace("{version}", version)}</p>
            <div className='flex flex-wrap gap-2'>
                <Button onPress={()=>showSetting("/update")}>{language.data.offline.actions.back}</Button>
            </div>
            <span className='text-xs text-foreground opacity-40 absolute bottom-4'>
                {(()=>{
                    const s = language.data.offline.note.normal.split("{link}");
                    return <>
                    {s[0]}
                    <Link className='text-foreground/40 text-xs' href='https://github.com/ponlponl123/youtube-standalone-electron/compare' target='_blank'>{language.data.offline.note.link}</Link>
                    {s[1]}
                    </>
                })()}
            </span>
        </div>
    )
}

export default Offline