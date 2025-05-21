import React from 'react'
import Sidebar from './sidebar'
import Toolbar from './toolbar'
import { ScrollShadow } from '@heroui/react'

function Workspace({ children }: { children: React.ReactNode }) {
  return (
    <div className='workspace-container absolute top-[2.4rem] left-0 w-full h-[calc(100%_-_2.4rem)] flex bg-(--root-title-background)'>
        <Sidebar />
        <div className="workspace relative flex-1 flex flex-col">
            <div className="workspace-header">
                <Toolbar />
            </div>
            <div className="workspace-content relative flex-1 overflow-auto m-2 rounded-lg bg-(--background)">
                <ScrollShadow className='h-full w-full p-2'>
                    {children}
                </ScrollShadow>
            </div>
        </div>
    </div>
  )
}

export default Workspace