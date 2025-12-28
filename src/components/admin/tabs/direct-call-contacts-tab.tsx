
"use client";

import { useState, useEffect } from 'react';
import { getDirectCallContacts, updateDirectCallContacts, DirectCallContact } from '@/lib/direct-call-contacts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";

export function DirectCallContactsTab() {
    const [contacts, setContacts] = useState<DirectCallContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newContact, setNewContact] = useState({ name: '', role: '', phone: '' });
    const { toast } = useToast();

    useEffect(() => {
        const fetchContacts = async () => {
            const fetchedContacts = await getDirectCallContacts();
            setContacts(fetchedContacts);
            setLoading(false);
        };

        fetchContacts();
    }, []);

    const handleAddContact = async () => {
        const newId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
        const updatedContacts = [...contacts, { id: newId, ...newContact }];
        const success = await updateDirectCallContacts(updatedContacts);
        if (success) {
            setContacts(updatedContacts);
            setIsAdding(false);
            setNewContact({ name: '', role: '', phone: '' });
            toast({ title: "Success", description: "Contact added successfully." });
        } else {
            toast({ title: "Error", description: "Failed to add contact.", variant: "destructive" });
        }
    };

    const handleDeleteContact = async (id: number) => {
        const updatedContacts = contacts.filter(contact => contact.id !== id);
        const success = await updateDirectCallContacts(updatedContacts);
        if (success) {
            setContacts(updatedContacts);
            toast({ title: "Success", description: "Contact deleted successfully." });
        } else {
            toast({ title: "Error", description: "Failed to delete contact.", variant: "destructive" });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Direct Call Contacts</CardTitle>
                <Dialog open={isAdding} onOpenChange={setIsAdding}>
                    <DialogTrigger asChild>
                        <Button>Add New Contact</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Contact</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input id="name" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role" className="text-right">Role</Label>
                                <Input id="role" value={newContact.role} onChange={(e) => setNewContact({ ...newContact, role: e.target.value })} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right">Phone</Label>
                                <Input id="phone" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} className="col-span-3" />
                            </div>
                        </div>
                        <Button onClick={handleAddContact}>Save Contact</Button>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contacts.map((contact) => (
                            <TableRow key={contact.id}>
                                <TableCell>{contact.name}</TableCell>
                                <TableCell>{contact.role}</TableCell>
                                <TableCell>{contact.phone}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteContact(contact.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
