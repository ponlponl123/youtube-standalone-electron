import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Button, Form, Input, Popover, PopoverContent, PopoverTrigger, Slider, SliderValue, Spinner } from '@heroui/react'
import { ArrowClockwise, CaretLeft, CaretRight, Equalizer, House, MagnifyingGlassMinus, Minus, Plus } from '@phosphor-icons/react'
import EqualizerPanel from './equalizer';
import { defaultTab, useTabs } from '../contexts/tabsContext';
import { isAnyYouTubeUrl } from '../utils/yt-url';

function Toolbar() {
    const { tabs, editTab } = useTabs();
    const activeTab = tabs.find((tab) => tab.isActive);
    const [ addressBarFocused, setAddressBarFocused ] = React.useState(false);
    const [zoomValue, setZoomValue] = React.useState<SliderValue>(activeTab?.zoom ? (activeTab?.zoom + 1) * 100 : 100);
    const [ addressBarValue, setAddressBarValue ] = React.useState(activeTab ? activeTab.url : 'https://www.youtube.com/');
    React.useEffect(() => {
        if (tabs) {
            const tab = tabs.find((tab) => tab.isActive);
            if (tab) setAddressBarValue(tab.url);
        }
    }, [tabs])
    return (
        <div className='toolbar-container flex-1 min-h-max flex justify-center items-start gap-1 mx-2 pt-1'>
            <div className='toolbar-actions flex gap-1'>
                <AnimatePresence key={"toolbar-actions-animate-presence"}>
                    {
                        activeTab?.webview?.current?.canGoBack() &&
                        <Button className='min-h-0 min-w-0' variant='light' radius='full' size='sm' isIconOnly
                            onPress={() => {activeTab?.webview?.current?.goBack()}}><CaretLeft size={14} /></Button>
                    }
                    {
                        activeTab?.webview?.current?.canGoForward() &&
                        <Button className='min-h-0 min-w-0' variant='light' radius='full' size='sm' isIconOnly
                            onPress={() => {activeTab?.webview?.current?.goForward()}}><CaretRight size={14} /></Button>
                    }
                    <Button className='min-h-0 min-w-0' variant='light' radius='full' size='sm' isIconOnly
                        isDisabled={activeTab?.webview?.current?.isLoading()}
                        onPress={() => {
                            if (!activeTab?.webview?.current?.isLoading())
                                activeTab?.webview?.current?.reload()
                            else activeTab?.webview?.current?.stop();
                        }}>
                        {
                            activeTab?.webview?.current?.isLoading() ? <Spinner color='current' size='sm' className='scale-70' /> :
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
                        if (tab) {
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
                            className='w-full h-full'
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
                                const tab = tabs.find((tab) => tab.isActive);
                                if (tab) {
                                    editTab(tab.id, {
                                        ...tab,
                                        url: e.currentTarget.value,
                                        name: e.currentTarget.value,
                                    });
                                }
                            }}
                            placeholder='https://www.youtube.com/'
                            onFocus={() => setAddressBarFocused(true)}
                            onBlur={() => setAddressBarFocused(false)}
                            validate={(value)=>{
                                if (!isAnyYouTubeUrl(value)) return "Address must be youtube url!";
                            }}
                        />
                        {
                            addressBarFocused && (
                                <div className='absolute top-0 right-0 flex items-center gap-1'>

                                </div>
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
                                    onPress={() => setZoomValue((prev) => (Number(prev) <= 175 ? Number(prev) + 25 : 200))}
                                >
                                    <Plus size={14} />
                                </Button>
                            }
                            size="sm"
                            minValue={0}
                            maxValue={200}
                            step={25}
                            marks={[
                                {
                                    value: 25,
                                    label: "25%",
                                },
                                {
                                    value: 100,
                                    label: "100%",
                                },
                                {
                                    value: 200,
                                    label: "200%",
                                },
                            ]}
                            startContent={
                                <Button
                                    isIconOnly
                                    radius="full"
                                    variant="light"
                                    size='sm'
                                    onPress={() => setZoomValue((prev) => (Number(prev) >= 25 ? Number(prev) - 25 : 0))}
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
    )
}

export default Toolbar