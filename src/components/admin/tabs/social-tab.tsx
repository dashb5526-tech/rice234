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
import { getSocialLinks, saveSocialLink, deleteSocialLink, SocialLink } from "@/lib/social-links";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2, Facebook, Instagram, Linkedin } from "lucide-react";
import { XIcon } from "@/components/icons";
import { SocialLinkEditDialog } from "@/components/admin/social-link-edit-dialog";

const iconMap: { [key: string]: React.ReactNode } = {
    Facebook: <Facebook className="h-5 w-5" />,
    X: <XIcon className="h-5 w-5" />,
    Instagram: <Instagram className="h-5 w-5" />,
    Linkedin: <Linkedin className="h-5 w-5" />,
};

export function SocialTab() {
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [isSocialLinkDialogOpen, setIsSocialLinkDialogOpen] = useState(false);
    const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null);
    const { toast } = useToast();

    const fetchData = async () => {
        try {
            const data = await getSocialLinks();
            setSocialLinks(data);
        } catch (error) {
            console.error("Failed to fetch social links data", error);
            toast({
                title: "Error",
                description: "Failed to load social links.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSocialLinkSave = async (linkData: Omit<SocialLink, 'id'>, id?: string) => {
        try {
            const newLink: SocialLink = { ...linkData, id: id || `social-${Date.now()}` };
            await saveSocialLink(newLink);
            setSocialLinks(prev => {
                if (id) {
                    return prev.map(l => l.id === id ? newLink : l);
                } else {
                    return [...prev, newLink];
                }
            });
            setIsSocialLinkDialogOpen(false);
            toast({ title: "Social Link Saved", description: "Social link has been saved." });
        } catch (error) {
            toast({ title: "Save Failed", description: "Could not save social link.", variant: "destructive" });
        }
    };

    const handleSocialLinkDelete = async (id: string) => {
        try {
            await deleteSocialLink(id);
            setSocialLinks(prev => prev.filter(l => l.id !== id));
            toast({ title: "Social Link Deleted", description: "Social link has been removed." });
        } catch (error) {
            toast({ title: "Delete Failed", description: "Could not delete social link.", variant: "destructive" });
        }
    };

    const openSocialLinkDialogForNew = () => {
        setEditingSocialLink(null);
        setIsSocialLinkDialogOpen(true);
    };

    const openSocialLinkDialogForEdit = (link: SocialLink) => {
        setEditingSocialLink(link);
        setIsSocialLinkDialogOpen(true);
    };

    return (
        <div className="pt-6">
            <Card>
                <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <CardTitle className="font-headline text-2xl">
                            Social Media Management
                        </CardTitle>
                        <CardDescription>
                            Add, edit, or remove your social media links.
                        </CardDescription>
                    </div>
                    <Button onClick={openSocialLinkDialogForNew} className="w-full sm:w-auto" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Social Link
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Platform</TableHead>
                                <TableHead className="hidden sm:table-cell">URL</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {socialLinks.map((link) => (
                                <TableRow key={link.id}>
                                    <TableCell className="font-medium flex items-center gap-3">
                                        {iconMap[link.icon]} {link.name}
                                    </TableCell>
                                    <TableCell className="hidden text-muted-foreground sm:table-cell">{link.url}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => openSocialLinkDialogForEdit(link)}>
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => link.id && handleSocialLinkDelete(link.id)}>
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

            <SocialLinkEditDialog
                isOpen={isSocialLinkDialogOpen}
                setIsOpen={setIsSocialLinkDialogOpen}
                socialLink={editingSocialLink}
                onSave={handleSocialLinkSave}
            />
        </div>
    );
}
