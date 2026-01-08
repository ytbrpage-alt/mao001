// src/components/ui/Accordion.tsx
// Mobile-first accordion component

'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
    title: string;
    children: ReactNode;
    isOpen?: boolean;
    onToggle?: () => void;
    icon?: ReactNode;
    badge?: ReactNode;
}

export function AccordionItem({
    title,
    children,
    isOpen = false,
    onToggle,
    icon,
    badge,
}: AccordionItemProps) {
    return (
        <div className="border-b border-neutral-200 last:border-b-0">
            <button
                type="button"
                onClick={onToggle}
                className="w-full flex items-center justify-between py-4 px-1 text-left hover:bg-neutral-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {icon && <div className="text-neutral-500">{icon}</div>}
                    <span className="font-medium text-neutral-900">{title}</span>
                    {badge}
                </div>
                <ChevronDown
                    className={cn(
                        'w-5 h-5 text-neutral-400 transition-transform duration-200',
                        isOpen && 'rotate-180'
                    )}
                />
            </button>
            <div
                className={cn(
                    'overflow-hidden transition-all duration-200',
                    isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                )}
            >
                <div className="pb-4 px-1">{children}</div>
            </div>
        </div>
    );
}

interface AccordionProps {
    items: {
        id: string;
        title: string;
        content: ReactNode;
        icon?: ReactNode;
        badge?: ReactNode;
    }[];
    allowMultiple?: boolean;
    defaultOpen?: string[];
}

export function Accordion({
    items,
    allowMultiple = false,
    defaultOpen = [],
}: AccordionProps) {
    const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

    const handleToggle = (id: string) => {
        if (allowMultiple) {
            setOpenItems((prev) =>
                prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
            );
        } else {
            setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
        }
    };

    return (
        <div className="divide-y divide-neutral-200 border-t border-neutral-200">
            {items.map((item) => (
                <AccordionItem
                    key={item.id}
                    title={item.title}
                    icon={item.icon}
                    badge={item.badge}
                    isOpen={openItems.includes(item.id)}
                    onToggle={() => handleToggle(item.id)}
                >
                    {item.content}
                </AccordionItem>
            ))}
        </div>
    );
}
