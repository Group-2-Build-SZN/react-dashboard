import { ArrowLeft } from 'lucide-react';
import React from 'react'
import './ScreenHeader.scss'


interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    onBack: () => void;
    rightSlot?: React.ReactNode;
}


const ScreenHeader = ({ title, subtitle, onBack, rightSlot }: ScreenHeaderProps) => {
    return (
        <header className='screen-header'>
            <button className='screen-header__back'
                onClick={onBack}
                aria-label='Go back'
            >
                <ArrowLeft size={20} />
            </button>
            <div className='screen-header__titles'>
                <h1 className='screen-header__title'>{title}</h1>
                {subtitle && <p className='screen-header__subtitle'>{subtitle}</p>}
            </div>
            {rightSlot && <div className='screen-header__right'>
                {rightSlot}
            </div>}
        </header>
    )
}

export default ScreenHeader;