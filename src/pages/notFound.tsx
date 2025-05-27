import { useRoute } from '../contexts/routeContext';
import { Plugs } from '@phosphor-icons/react';
import { Button } from '@heroui/react';
import { useLanguage } from '../contexts/langContext';

function Offline() {
  const { language } = useLanguage();
  const { route, setRoute } = useRoute();
  return (
    <div className='absolute top-[2.4rem] left-0 w-full h-[calc(100%_-_2.4rem)] flex flex-col gap-4 items-center justify-center bg-(--background)/90 rounded-lg'>
      <Plugs size={48} />
      <h1 className='text-2xl flex gap-2'>{(()=>{
        const s = language.data.notFound.title.split("{pathname}");
        return <>
          {s[0]}
          <pre className='bg-foreground/20 px-2 rounded-lg'>{route}</pre>
          {s[1]}
        </>
      })()}</h1>
      <p>{language.data.notFound.description}</p>
      <div className='flex flex-wrap gap-2'>
        <Button onPress={() => setRoute('/')}>{language.data.notFound.actions.back}</Button>
      </div>
    </div>
  )
}

export default Offline