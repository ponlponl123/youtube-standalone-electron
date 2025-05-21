import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Button, Form, Input, Popover, PopoverContent, PopoverTrigger } from '@heroui/react'
import { ArrowClockwise, CaretLeft, CaretRight, Equalizer, House, LockSimple, MagnifyingGlassMinus } from '@phosphor-icons/react'
import EqualizerPanel from './equalizer';

function Toolbar() {
    const [ addressBarFocused, setAddressBarFocused ] = React.useState(false);
    return (
        <div className='toolbar-container flex-1 min-h-max flex justify-center items-start gap-1 mx-2 pt-1'>
            <div className='toolbar-actions flex gap-1'>
                <AnimatePresence>
                    <Button className='min-h-0 min-w-0' variant='light' radius='full' size='sm' isIconOnly><CaretLeft size={14} /></Button>
                    <Button className='min-h-0 min-w-0' variant='light' radius='full' size='sm' isIconOnly><CaretRight size={14} /></Button>
                    <Button className='min-h-0 min-w-0' variant='light' radius='full' size='sm' isIconOnly><ArrowClockwise size={14} /></Button>
                    <Button className='min-h-0 min-w-0' variant='light' radius='full' size='sm' isIconOnly><House size={14} /></Button>
                </AnimatePresence>
            </div>
            <div className='address-bar flex-1 min-w-0'>
                <Form onSubmit={(e) => {
                    e.preventDefault();
                    const data = Object.fromEntries(new FormData(e.currentTarget));
                    console.log(data);
                }}>
                    <div className='relative w-full h-full'>
                        <Input
                            isRequired
                            type="text"
                            className='w-full h-full'
                            name="address"
                            variant='bordered'
                            startContent={
                                <Button className='min-h-0 min-w-0' color='success' variant='light' radius='full' size='sm' isIconOnly><LockSimple size={14} /></Button>
                            }
                            classNames={{
                                input: 'text-xs'
                            }}
                            size='sm'
                            radius='full'
                            placeholder='https://www.youtube.com/'
                            onFocus={() => setAddressBarFocused(true)}
                            onBlur={() => setAddressBarFocused(false)}
                            validate={(value)=>{
                                if (!(
                                    value === 'https://www.youtube.com' ||
                                    value === 'https://youtube.com' ||
                                    value === 'https://www.youtu.be' ||
                                    value === 'https://youtu.be' ||
                                    
                                    value.startsWith('https://www.youtube.com/') ||
                                    value.startsWith('https://youtube.com/') ||
                                    value.startsWith('https://www.youtu.be/') ||
                                    value.startsWith('https://youtu.be/') ||

                                    value === 'www.youtube.com' ||
                                    value === 'youtube.com' ||
                                    value === 'www.youtu.be' ||
                                    value === 'youtu.be' ||

                                    value.startsWith('www.youtube.com/') ||
                                    value.startsWith('youtube.com/') ||
                                    value.startsWith('www.youtu.be/') ||
                                    value.startsWith('youtu.be/')

                                    // Youtube Music
                                    || value === 'https://music.youtube.com' ||
                                    value.startsWith('https://music.youtube.com/') ||
                                    value === 'music.youtube.com' ||
                                    value.startsWith('music.youtube.com/')
                                )) return "Address must be youtube url!";
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
            <Button className='min-h-0 min-w-0' variant='light' radius='full' size='sm' isIconOnly><MagnifyingGlassMinus size={14} /></Button>
        </div>
    )
}

export default Toolbar