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
import { getContactInfo, saveContactInfo, ContactInfo } from "@/lib/contact-info";
import { getContactSection, saveContactSection, ContactSection } from "@/lib/contact-section";
import { useToast } from "@/hooks/use-toast";
import { Edit } from "lucide-react";
import { ContactInfoEditDialog } from "@/components/admin/contact-info-edit-dialog";
import { ContactSectionEditDialog } from "@/components/admin/contact-section-edit-dialog";

export function ContactTab() {
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const [contactSection, setContactSection] = useState<ContactSection | null>(null);
    const [isContactInfoDialogOpen, setIsContactInfoDialogOpen] = useState(false);
    const [isContactSectionDialogOpen, setIsContactSectionDialogOpen] = useState(false);
    const { toast } = useToast();

    const fetchData = async () => {
        try {
            const infoData = await getContactInfo();
            setContactInfo(infoData);
            const sectionData = await getContactSection();
            setContactSection(sectionData);
        } catch (error) {
            console.error("Failed to fetch contact data", error);
            toast({
                title: "Error",
                description: "Failed to load contact data.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleContactInfoSave = async (info: ContactInfo, selectedFile: File | null) => {
        try {
            let finalImageUrl = info.imageUrl;
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                const response = await fetch('/api/upload', { method: 'POST', body: formData });
                if (response.ok) {
                    const result = await response.json();
                    finalImageUrl = result.imageUrl;
                }
            }
            const newInfo = { ...info, imageUrl: finalImageUrl };
            await saveContactInfo(newInfo);
            setContactInfo(newInfo);
            setIsContactInfoDialogOpen(false);
            toast({ title: "Contact Info Saved", description: "Contact information has been updated." });
        } catch (error) {
            toast({ title: "Save Failed", description: "Could not save contact info.", variant: "destructive" });
        }
    };

    const handleContactSectionSave = async (content: ContactSection) => {
        try {
            await saveContactSection(content);
            setContactSection(content);
            setIsContactSectionDialogOpen(false);
            toast({ title: "Section Updated", description: "Contact section content saved." });
        } catch (error) {
            toast({ title: "Save Failed", description: "Could not save section content.", variant: "destructive" });
        }
    };

    return (
        <div className="pt-6">
            <Card>
                <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <CardTitle className="font-headline text-2xl">
                            Contact Information
                        </CardTitle>
                        <CardDescription>
                            Edit the contact details and section text on your site.
                        </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button onClick={() => setIsContactSectionDialogOpen(true)} className="w-full sm:w-auto" variant="outline" disabled={!contactSection}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Section Text
                        </Button>
                        <Button onClick={() => setIsContactInfoDialogOpen(true)} className="w-full sm:w-auto" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} disabled={!contactInfo}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Contact Info
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {contactInfo ? (
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold">Address</h4>
                                <p className="text-sm text-muted-foreground">{contactInfo.address}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">Phone</h4>
                                <p className="text-sm text-muted-foreground">{contactInfo.phone}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">Email</h4>
                                <p className="text-sm text-muted-foreground">{contactInfo.email}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">WhatsApp Number</h4>
                                <p className="text-sm text-muted-foreground">{contactInfo.whatsappNumber}</p>
                            </div>
                        </div>
                    ) : (
                        <p>Loading contact information...</p>
                    )}
                </CardContent>
            </Card>

            {contactInfo && (
                <ContactInfoEditDialog
                    isOpen={isContactInfoDialogOpen}
                    setIsOpen={setIsContactInfoDialogOpen}
                    info={contactInfo}
                    onSave={handleContactInfoSave}
                />
            )}

            {contactSection && (
                <ContactSectionEditDialog
                    isOpen={isContactSectionDialogOpen}
                    setIsOpen={setIsContactSectionDialogOpen}
                    content={contactSection}
                    onSave={handleContactSectionSave}
                />
            )}
        </div>
    );
}
