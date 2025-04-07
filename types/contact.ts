export interface Contact {
    name: string;
    email: string;
    phone: string;
    message: string;
    createdAt?: Date; // Optional, as this may not be provided when creating a new contact
    updatedAt?: Date; // Optional, as this may not be provided when creating a new contact
}
