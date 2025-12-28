
export interface DirectCallContact {
    id: number;
    name: string;
    role: string;
    phone: string;
}

export async function getDirectCallContacts(): Promise<DirectCallContact[]> {
    try {
        const response = await fetch('/api/direct-call-contacts');
        if (!response.ok) {
            throw new Error('Failed to fetch contacts');
        }
        const contacts = await response.json();
        return contacts;
    } catch (error) {
        console.error("Could not fetch direct call contacts:", error);
        return [];
    }
}

export async function updateDirectCallContacts(contacts: DirectCallContact[]): Promise<boolean> {
    try {
        const response = await fetch('/api/direct-call-contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contacts),
        });
        return response.ok;
    } catch (error) {
        console.error("Could not update direct call contacts:", error);
        return false;
    }
}
