import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, Form, Input, Popover, PopoverContent, PopoverTrigger, Progress, Slider, SliderValue, Spinner } from '@heroui/react'
import { ArrowClockwise, CaretLeft, CaretRight, Equalizer, House, MagnifyingGlassMinus, Minus, Plus } from '@phosphor-icons/react'
import EqualizerPanel from './equalizer';
import { defaultTab, useTabs } from '../contexts/tabsContext';
import { isAnyYouTubeUrl } from '../utils/yt-url';

function Toolbar() {
    const { tabs, editTab } = useTabs();
    const activeTab = React.useMemo(() => tabs.find((tab) => tab.isActive), [tabs]);
    const webview = React.useMemo(() => activeTab?.webview?.current, [activeTab?.webview]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [addressBarFocused, setAddressBarFocused] = React.useState(false);
    const [zoomValue, setZoomValue] = React.useState<SliderValue>(100);
    const [addressBarValue, setAddressBarValue] = React.useState('https://www.youtube.com/');
    
    // Update loading state and navigation state when webview changes
    React.useEffect(() => {
        if (!webview) {
            setIsLoading(false);
            return;
        }

        const handleStartLoading = () => setIsLoading(true);
        const handleStopLoading = () => {
            setIsLoading(false);
        }
        
        try {
            webview.addEventListener('did-start-loading', handleStartLoading);
            webview.addEventListener('did-stop-loading', handleStopLoading);
            setIsLoading(webview.isLoading());
        } catch (error) {
            console.debug('Error setting up loading listeners:', error);
        }
        
        return () => {
            try {
                webview.removeEventListener('did-start-loading', handleStartLoading);
                webview.removeEventListener('did-stop-loading', handleStopLoading);
            } catch (error) {
                console.debug('Error cleaning up loading listeners:', error);
            }
            setIsLoading(false);
        };
    }, [webview]);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            const zoom = (Number(zoomValue) / 100) - 1;
            if (activeTab?.id && Math.abs((activeTab.zoom || 0) - zoom) > 0.001) {
                editTab(activeTab.id, {zoom});
            }
        }, 100); // Debounce zoom updates by 100ms
        return () => clearTimeout(timeout);
    }, [activeTab, editTab, zoomValue]);

    return (
        <div className='toolbar-container flex-1 min-h-max flex flex-col justify-start items-start gap-1 mx-2 pt-1'>
            <div className='tool-bar-actions flex w-full justify-center items-start gap-1'>
                <div className='toolbar-actions flex gap-1'>
                    <AnimatePresence key={"toolbar-actions-animate-presence"}>                        {
                            activeTab?.ready && activeTab?.webview?.current?.canGoBack() &&
                            <motion.div layoutId='toolbar-actions-back-btn' key={'toolbar-actions-back-btn'}
                                initial={{ opacity: 0, marginLeft: -36, x: 64 }} animate={{ opacity: 1, marginLeft: 0, x: 0 }} exit={{ opacity: 0, marginLeft: -36 }}>                                
                                <Button className='min-h-0 min-w-0' variant='light' radius='full' size='sm' isIconOnly
                                    aria-label="Go back"
                                    onPress={() => webview?.goBack()}><CaretLeft size={14} /></Button>
                            </motion.div>
                        }
                        {
                            activeTab?.ready && activeTab?.webview?.current?.canGoForward() &&
                            <motion.div layoutId='toolbar-actions-next-btn' key={'toolbar-actions-next-btn'}
                                initial={{ opacity: 0, marginLeft: -36, x: 64 }} animate={{ opacity: 1, marginLeft: 0, x: 0 }} exit={{ opacity: 0, marginLeft: -36 }}>                                
                                <Button className='min-h-0 min-w-0' variant='light' radius='full' size='sm' isIconOnly
                                    aria-label="Go forward"
                                    onPress={() => webview?.goForward()}><CaretRight size={14} /></Button>
                            </motion.div>
                        }
                        <Button className='min-h-0 min-w-0' variant='light' radius='full' size='sm' isIconOnly
                            aria-label="Reload page"
                            isDisabled={isLoading}
                            onPress={() => webview?.reload()}>
                            {
                                isLoading ? <Spinner color='current' size='sm' className='scale-70' /> :
                                <ArrowClockwise size={14} />
                            }
                        </Button>
                    </AnimatePresence>
                </div>
                <div className='address-bar flex-1 min-w-0'>
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        const data = Object.fromEntries(new FormData(e.currentTarget));
                        if ( data.address && isAnyYouTubeUrl(String(data?.address)) )
                        {
                            const url = String(data?.address);
                            const tab = tabs.find((tab) => tab.isActive);
                            if (tab && tab.url !== url) {
                                setAddressBarValue(url);
                                editTab(tab.id, {
                                    ...tab,
                                    url: url,
                                    name: url,
                                });
                                if (tab.webview?.current) tab.webview?.current.loadURL(url);
                            }
                        }
                    }}>
                        <div className='relative w-full h-full'>
                            <Input
                                isRequired
                                type="text"
                                className='w-full h-full z-10'
                                name="address"
                                key={"browser-address-bar-input"}
                                variant='bordered'
                                startContent={
                                    <Button className='min-h-0 min-w-0' variant='light' radius='full' size='sm' isIconOnly
                                        onPress={() => {activeTab?.id&&editTab(activeTab?.id, defaultTab)}}><House size={14} /></Button>
                                }
                                classNames={{
                                    input: 'text-xs'
                                }}
                                size='sm'
                                radius='full'
                                value={addressBarValue}
                                onChange={(e) => {
                                    setAddressBarValue(e.currentTarget.value);
                                }}
                                placeholder='https://www.youtube.com/'
                                onFocus={() => setAddressBarFocused(true)}
                                onBlur={() => setAddressBarFocused(false)}
                                validate={(value)=>{
                                    if (!isAnyYouTubeUrl(value)) return "Address must be youtube url!";
                                }}
                            />
                            {
                                isLoading &&
                                <Progress color='danger' className='h-[2px] w-[calc(100%_-_1.5rem)] absolute top-[30px] left-3 z-10' size='sm' isIndeterminate />
                            }
                            {
                                addressBarFocused && (
                                    <motion.div
                                        data-focus-ignore="true"
                                        layoutId='browser-suggestions-container'
                                        key={'browser-suggestions-container'}
                                        initial={{opacity:0, maxHeight:0}} animate={{opacity:1, maxHeight: "64vh"}} exit={{opacity:0, maxHeight:0}}
                                        className='absolute -top-1 -left-1 w-[calc(100%_+_0.5rem)] min-h-64 bg-(--background)/90 backdrop-blur-2xl backdrop-saturate-150 shadow-2xl rounded-[20px] p-3 overflow-hidden'>
                                        <div className='bg-white w-full h-full'>

                                        </div>
                                    </motion.div>
                                )
                            }
                        </div>
                    </Form>
                </div>
                <Popover placement="bottom">
                    <PopoverTrigger>
                        <Button className='min-h-0 min-w-0' variant='light' radius='full' size='sm' isIconOnly><Equalizer size={14} /></Button>
                    </PopoverTrigger>
                    <PopoverContent><EqualizerPanel /></PopoverContent>
                </Popover>
                <Popover placement="bottom">
                    <PopoverTrigger>
                        <Button className='min-h-0 min-w-0' variant='light' radius='full' size='sm' isIconOnly><MagnifyingGlassMinus size={14} /></Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="p-2 text-center w-64 flex items-center gap-2">
                            <Slider
                                aria-label="Volume"
                                className="max-w-md"
                                classNames={{
                                    mark: 'text-xs mt-3'
                                }}
                                color='danger'
                                endContent={
                                    <Button
                                        isIconOnly
                                        radius="full"
                                        variant="light"
                                        size='sm'
                                        onPress={() => setZoomValue((prev) => (Number(prev) <= 350 ? Number(prev) + 50 : 400))}
                                    >
                                        <Plus size={14} />
                                    </Button>
                                }
                                size="sm"
                                minValue={-200}
                                maxValue={400}
                                step={25}
                                marks={[
                                    {
                                        value: -200,
                                        label: "-200%",
                                    },
                                    {
                                        value: 100,
                                        label: "100%",
                                    },
                                    {
                                        value: 400,
                                        label: "400%",
                                    },
                                ]}
                                startContent={
                                    <Button
                                        isIconOnly
                                        radius="full"
                                        variant="light"
                                        size='sm'
                                        onPress={() => setZoomValue((prev) => (Number(prev) >= -150 ? Number(prev) - 50 : -200))}
                                    >
                                        <Minus size={14} />
                                    </Button>
                                }
                                value={zoomValue}
                                onChange={setZoomValue}
                                key={"browser-zoom-slider"}
                            />
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <div className='info-bar flex w-full min-w-0 relative'>
            </div>
        </div>
    )
}

export default Toolbar