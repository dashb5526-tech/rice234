"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { getPartners, savePartner, deletePartner, Partner } from "@/lib/partners";
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { PartnerEditDialog } from "@/components/admin/partner-edit-dialog";

export function PartnersTab() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [isPartnerDialogOpen, setIsPartnerDialogOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
    const { toast } = useToast();

    const fetchData = async () => {
        try {
            const data = await getPartners();
            setPartners(data);
        } catch (error) {
            console.error("Failed to fetch partners data", error);
            toast({
                title: "Error",
                description: "Failed to load partners data.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePartnerSave = async (partnerData: Partner, selectedFile: File | null) => {
        try {
            let finalLogoUrl = partnerData.logoUrl;
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                const response = await fetch('/api/upload', { method: 'POST', body: formData });
                if (response.ok) {
                    const result = await response.json();
                    finalLogoUrl = result.imageUrl;
                }
            }

            const newPartnerData = { ...partnerData, logoUrl: finalLogoUrl };
            await savePartner(newPartnerData);
            setPartners(prev => {
                const index = prev.findIndex(p => p.id === newPartnerData.id);
                if (index >= 0) {
                    const newPartners = [...prev];
                    newPartners[index] = newPartnerData;
                    return newPartners;
                } else {
                    return [...prev, newPartnerData];
                }
            });
            setIsPartnerDialogOpen(false);
            toast({ title: "Partner Saved", description: "Partner has been successfully saved." });
        } catch (error) {
            toast({ title: "Save Failed", description: "Could not save partner.", variant: "destructive" });
        }
    };

    const handlePartnerDelete = async (id: string) => {
        try {
            await deletePartner(id);
            setPartners(prev => prev.filter(p => p.id !== id));
            toast({ title: "Partner Deleted", description: "Partner has been removed." });
        } catch (error) {
            toast({ title: "Delete Failed", description: "Could not delete partner.", variant: "destructive" });
        }
    };

    const openPartnerDialogForNew = () => {
        setEditingPartner(null);
        setIsPartnerDialogOpen(true);
    };

    const openPartnerDialogForEdit = (partner: Partner) => {
        setEditingPartner(partner);
        setIsPartnerDialogOpen(true);
    };

    return (
        <div className="pt-6">
            <Card>
                <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <CardTitle className="font-headline text-2xl">
                            Partner Management
                        </CardTitle>
                        <CardDescription>
                            Manage your proud partner logos.
                        </CardDescription>
                    </div>
                    <Button onClick={openPartnerDialogForNew} className="w-full sm:w-auto" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Partner
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Partner Name</TableHead>
                                <TableHead className="hidden sm:table-cell">Logo</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {partners.map((partner) => (
                                <TableRow key={partner.id}>
                                    <TableCell className="font-medium">{partner.name}</TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        {partner.logoUrl && (
                                            <Image src={partner.logoUrl} alt={partner.name} width={100} height={40} className="object-contain" />
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => openPartnerDialogForEdit(partner)}>
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handlePartnerDelete(partner.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <PartnerEditDialog
                isOpen={isPartnerDialogOpen}
                setIsOpen={setIsPartnerDialogOpen}
                partner={editingPartner}
                onSave={handlePartnerSave}
            />
        </div>
    );
}
