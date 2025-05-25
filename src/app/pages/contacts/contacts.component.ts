import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ContactService, Contact } from '../../services/contact.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
})
export class ContactsComponent {
  currentUser: any = null;
  contacts: Contact[] = [];
  errorMessage = '';

  newContact: Partial<Contact> = {
    name: '',
    email: '',
    phone: '',
  };

  editingContact: Contact | null = null;

  constructor(
    public authService: AuthService,
    private contactService: ContactService
  ) {
    this.loadCurrentUser();
    this.loadContacts();
  }

  loadCurrentUser() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => (this.currentUser = user),
      error: (err) => console.error('Failed to load current user:', err),
    });
  }

  loadContacts() {
    this.contactService.getContacts().subscribe({
      next: (data) => {
        // Map _id to id for each contact
        this.contacts = data.map((contact) => ({
          ...contact,
          id: contact._id,
        }));
      },
      error: (err) => (this.errorMessage = 'Failed to load contacts'),
    });
  }

  addContact(): void {
    if (
      !this.newContact.name ||
      !this.newContact.email ||
      !this.newContact.phone
    )
      return;

    this.contactService.createContact(this.newContact as Contact).subscribe({
      next: (contact) => {
        this.contacts.push(contact);
        this.newContact = { name: '', email: '', phone: '' };
      },
      error: (err) => {
        this.errorMessage = 'Failed to add contact';
        console.error(err);
      },
    });
  }

  deleteContact(id: string): void {
    this.contactService.deleteContact(id).subscribe({
      next: () => {
        this.contacts = this.contacts.filter((c) => c.id !== id);
      },
      error: (err) => {
        this.errorMessage = 'Failed to delete contact';
        console.error(err);
      },
    });
  }

  selectContactForEdit(contact: Contact): void {
    this.editingContact = { ...contact };
  }

  cancelEditing(): void {
    this.editingContact = null;
  }

  updateContact(): void {
    if (!this.editingContact) return;

    const { id, name, email, phone } = this.editingContact;
    const updatePayload = { name, email, phone };

    this.contactService.updateContact(id, updatePayload).subscribe({
      next: (updatedContact) => {
        this.editingContact = null;
        this.loadContacts(); // reload contacts to refresh UI
      },
      error: (err) => {
        this.errorMessage = 'Failed to update contact';
        console.error(err);
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
