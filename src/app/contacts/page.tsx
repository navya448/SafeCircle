
"use client"
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus, Trash2, MoreVertical, Edit } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Contact {
  id: number;
  name: string;
  relationship: string;
  email: string;
}

const defaultContacts: Contact[] = [
    { id: 1, name: 'Campus Security', relationship: 'Security', email: 'security@snu.edu.in' },
    { id: 2, name: 'University Health Center', relationship: 'Medical', email: 'health.center@snu.edu.in' },
]


export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [open, setOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const userDataString = localStorage.getItem('safeCircleUser')
    let userContacts: Contact[] = [];
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      // User contacts are now stored as an array of objects
      userContacts = userData.emergencyContacts || [];
    }
    // Combine university contacts with user's saved contacts
    // ensuring no duplicates if user adds a default one.
    const combinedContacts = [...defaultContacts];
    userContacts.forEach(uc => {
        if (!combinedContacts.some(dc => dc.email === uc.email)) {
            combinedContacts.push(uc);
        }
    });

    setContacts(combinedContacts);
  }, [])

  const updateLocalStorage = (updatedContacts: Contact[]) => {
     const userDataString = localStorage.getItem('safeCircleUser');
     if (userDataString) {
        const userData = JSON.parse(userDataString);
        // We only store personal contacts, not the default ones.
        const personalContacts = updatedContacts.filter(c => !defaultContacts.some(dc => dc.id === c.id));
        userData.emergencyContacts = personalContacts;
        localStorage.setItem('safeCircleUser', JSON.stringify(userData));
     }
  }


  const handleSaveContact = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newContactData = {
      name: formData.get('name') as string,
      relationship: formData.get('relationship') as string,
      email: formData.get('email') as string,
    }

    let updatedContacts;
    if (editingContact) {
      updatedContacts = contacts.map((c) =>
        c.id === editingContact.id ? { ...c, ...newContactData } : c
      )
      toast({ title: "Contact Updated", description: "The contact information has been saved." })
    } else {
      updatedContacts = [...contacts, { id: Date.now(), ...newContactData }]
      toast({ title: "Contact Added", description: "The new contact has been added to your list." })
    }
    
    setContacts(updatedContacts)
    updateLocalStorage(updatedContacts)
    setEditingContact(null)
    setOpen(false)
  }

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact)
    setOpen(true)
  }

  const handleDelete = (contactId: number) => {
    const isDefaultContact = defaultContacts.some(c => c.id === contactId);
    if (isDefaultContact) {
        toast({ title: "Cannot Delete", description: "Default contacts cannot be deleted.", variant: 'destructive' })
        return;
    }
    const updatedContacts = contacts.filter((c) => c.id !== contactId)
    setContacts(updatedContacts)
    updateLocalStorage(updatedContacts)
    toast({ title: "Contact Deleted", description: "The contact has been removed from your list.", variant: 'destructive' })
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setEditingContact(null);
    }
    setOpen(isOpen);
  }

  return (
    <div className="p-4 md:p-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Emergency Contacts</CardTitle>
            <CardDescription>
              Manage trusted contacts for SOS alerts. These contacts will be notified.
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSaveContact}>
                <DialogHeader>
                  <DialogTitle>{editingContact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
                  <DialogDescription>
                    This contact will be notified in an emergency.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" name="name" defaultValue={editingContact?.name} required className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="relationship" className="text-right">
                      Relationship
                    </Label>
                    <Input id="relationship" name="relationship" defaultValue={editingContact?.relationship} required className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" name="email" type="email" defaultValue={editingContact?.email} required className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Contact</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.relationship}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={defaultContacts.some(c => c.id === contact.id)}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEdit(contact)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this contact from your list.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(contact.id)}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
