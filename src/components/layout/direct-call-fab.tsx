
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDirectCallContacts, DirectCallContact } from '@/lib/direct-call-contacts';

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            {...props}
        >
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
    );
}

export function DirectCallFAB() {
    const [contacts, setContacts] = useState<DirectCallContact[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchContacts = async () => {
            const fetchedContacts = await getDirectCallContacts();
            setContacts(fetchedContacts);
        };

        fetchContacts();
    }, []);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    if (contacts.length === 0) {
        return null;
    }

    // If there is only one contact, make the FAB a direct call link
    if (contacts.length === 1) {
        return (
            <Link
                href={`tel:${contacts[0].phone}`}
                className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-opacity duration-300 hover:bg-primary-dark sm:h-16 sm:w-16"
                aria-label={`Call ${contacts[0].name}`}
            >
                <PhoneIcon className="h-6 w-6 sm:h-8 sm:w-8" />
            </Link>
        );
    }

    // If there are multiple contacts, show the selection dialog
    return (
        <>
            {isOpen && (
                <div className="fixed bottom-24 left-6 z-40 w-80 bg-white border border-gray-200 rounded-lg shadow-xl">
                    <div className="flex items-center justify-between p-4 bg-primary text-white rounded-t-lg">
                        <h3 className="text-lg font-semibold">Direct Call</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200"
                            aria-label="Close call window"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="p-4">
                        {contacts.map((contact) => (
                            <div key={contact.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                <div>
                                    <p className="font-semibold">{contact.name}</p>
                                    <p className="text-sm text-gray-600">{contact.role}</p>
                                </div>
                                <Link
                                    href={`tel:${contact.phone}`}
                                    className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
                                >
                                    Call
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <button
                onClick={handleToggle}
                className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-opacity duration-300 hover:bg-primary-dark sm:h-16 sm:w-16"
                aria-label="Open direct call window"
            >
                <PhoneIcon className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
        </>
    );
}
