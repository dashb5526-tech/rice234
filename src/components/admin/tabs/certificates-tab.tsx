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
import { getCertificates, saveCertificate, deleteCertificate, Certificate } from "@/lib/certificates";
import { getCertificatesSection, saveCertificatesSection, CertificatesSection } from "@/lib/certificates-section";
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { CertificateEditDialog } from "@/components/admin/certificate-edit-dialog";
import { CertificatesSectionEditDialog } from "@/components/admin/certificates-section-edit-dialog";

export function CertificatesTab() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [certificatesSection, setCertificatesSection] = useState<CertificatesSection | null>(null);
    const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
    const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
    const [isCertificatesSectionDialogOpen, setIsCertificatesSectionDialogOpen] = useState(false);
    const { toast } = useToast();

    const fetchData = async () => {
        try {
            const data = await getCertificates();
            setCertificates(data);
            const sectionData = await getCertificatesSection();
            setCertificatesSection(sectionData);
        } catch (error) {
            console.error("Failed to fetch certificates data", error);
            toast({
                title: "Error",
                description: "Failed to load certificates data.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCertificateSave = async (certData: Certificate, selectedFile: File | null) => {
        try {
            let finalImageUrl = certData.imageUrl;
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                const response = await fetch('/api/upload', { method: 'POST', body: formData });
                if (response.ok) {
                    const result = await response.json();
                    finalImageUrl = result.imageUrl;
                }
            }
            const newCertData = { ...certData, imageUrl: finalImageUrl };
            await saveCertificate(newCertData);
            setCertificates(prev => {
                const index = prev.findIndex(c => c.id === newCertData.id);
                if (index >= 0) {
                    const newCerts = [...prev];
                    newCerts[index] = newCertData;
                    return newCerts;
                } else {
                    return [...prev, newCertData];
                }
            });
            setIsCertificateDialogOpen(false);
            toast({ title: "Certificate Saved", description: "Certificate has been successfully saved." });
        } catch (error) {
            toast({ title: "Save Failed", description: "Could not save certificate.", variant: "destructive" });
        }
    };

    const handleCertificateDelete = async (id: string) => {
        try {
            await deleteCertificate(id);
            setCertificates(prev => prev.filter(c => c.id !== id));
            toast({ title: "Certificate Deleted", description: "Certificate has been removed." });
        } catch (error) {
            toast({ title: "Delete Failed", description: "Could not delete certificate.", variant: "destructive" });
        }
    };

    const handleCertificatesSectionSave = async (content: CertificatesSection) => {
        try {
            await saveCertificatesSection(content);
            setCertificatesSection(content);
            setIsCertificatesSectionDialogOpen(false);
            toast({ title: "Section Updated", description: "Certificates section content saved." });
        } catch (error) {
            toast({ title: "Save Failed", description: "Could not save section content.", variant: "destructive" });
        }
    };

    const openCertificateDialogForNew = () => {
        setEditingCertificate(null);
        setIsCertificateDialogOpen(true);
    };

    const openCertificateDialogForEdit = (cert: Certificate) => {
        setEditingCertificate(cert);
        setIsCertificateDialogOpen(true);
    };

    return (
        <div className="pt-6">
            <Card>
                <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <CardTitle className="font-headline text-2xl">
                            Certificate Management
                        </CardTitle>
                        <CardDescription>
                            Manage your company's legal and quality certificates.
                        </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button onClick={() => setIsCertificatesSectionDialogOpen(true)} className="w-full sm:w-auto" variant="outline" disabled={!certificatesSection}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Section Text
                        </Button>
                        <Button onClick={openCertificateDialogForNew} className="w-full sm:w-auto" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Certificate
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Certificate Name</TableHead>
                                <TableHead className="hidden sm:table-cell">Image</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {certificates.map((cert) => (
                                <TableRow key={cert.id}>
                                    <TableCell className="font-medium">{cert.name}</TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        {cert.imageUrl && (
                                            <Image src={cert.imageUrl} alt={cert.name} width={100} height={70} className="object-contain rounded" />
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => openCertificateDialogForEdit(cert)}>
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleCertificateDelete(cert.id)}>
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

            <CertificateEditDialog
                isOpen={isCertificateDialogOpen}
                setIsOpen={setIsCertificateDialogOpen}
                certificate={editingCertificate}
                onSave={handleCertificateSave}
            />

            {certificatesSection && (
                <CertificatesSectionEditDialog
                    isOpen={isCertificatesSectionDialogOpen}
                    setIsOpen={setIsCertificatesSectionDialogOpen}
                    content={certificatesSection}
                    onSave={handleCertificatesSectionSave}
                />
            )}
        </div>
    );
}
