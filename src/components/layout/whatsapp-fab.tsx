
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getContactInfo, ContactInfo } from '@/lib/contact-info';
import { cn } from '@/lib/utils';

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            {...props}
        >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" fill="currentColor"/>
        </svg>
    )
}

export function WhatsAppFAB() {
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchContactInfo = () => {
            getContactInfo().then(setContactInfo);
        };

        fetchContactInfo();

        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        window.addEventListener('focus', fetchContactInfo);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
            window.removeEventListener('focus', fetchContactInfo);
        };
    }, []);

    if (!contactInfo || !contactInfo.whatsappNumber) {
        return null;
    }

    const phoneNumber = contactInfo.whatsappNumber.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}`;

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-40 w-80 bg-white border border-gray-200 rounded-lg shadow-xl">
                    <div className="flex items-center justify-between p-4 bg-[#25D366] text-white rounded-t-lg">
                        <h3 className="text-lg font-semibold">Chat with us on WhatsApp</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200"
                            aria-label="Close chat window"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="p-4">
                        <p className="text-gray-700 mb-4">Hi! How can we help you today?</p>
                        <Link
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block w-full bg-[#25D366] text-white text-center py-2 px-4 rounded-md hover:bg-[#128C7E] transition-colors"
                        >
                            Start Chat
                        </Link>
                    </div>
                </div>
            )}
            <button
                onClick={handleToggle}
                className={cn(
                    "fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-opacity duration-300 hover:bg-[#128C7E]",
                    isVisible ? 'opacity-100' : 'opacity-0'
                )}
                aria-label="Open WhatsApp chat"
            >
                <WhatsAppIcon className="h-8 w-8" />
            </button>
        </>
    );
}
    
