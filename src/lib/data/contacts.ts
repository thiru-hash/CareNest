export interface Contact {
  id: string;
  name: string;
  relationship: string;
  email: string;
  phone: string;
  phone2?: string;
  note?: string;
  newsletter: boolean;
  author: string;
  createdAt: string;
}

export const mockContacts: Contact[] = [
  {
    id: "1027035",
    name: "Lauane Andrade",
    relationship: "Other Relatives/Whanau",
    email: "lauane.and@gmail.con",
    phone: "0273510407",
    note: "second mum",
    newsletter: false,
    author: "Carea PHILPOTT",
    createdAt: "2024-01-15"
  },
  {
    id: "1027033",
    name: "Erica Waters",
    relationship: "Parent (s)",
    email: "ehwaters_83@hotmail.com",
    phone: "02102556983",
    newsletter: false,
    author: "Carea PHILPOTT",
    createdAt: "2024-01-14"
  },
  {
    id: "1027034",
    name: "John Smith",
    relationship: "Guardian",
    email: "john.smith@email.com",
    phone: "0211234567",
    phone2: "0219876543",
    note: "Primary guardian",
    newsletter: true,
    author: "Carea PHILPOTT",
    createdAt: "2024-01-13"
  },
  {
    id: "1027036",
    name: "Sarah Johnson",
    relationship: "Sibling",
    email: "sarah.j@email.com",
    phone: "0215551234",
    newsletter: false,
    author: "Carea PHILPOTT",
    createdAt: "2024-01-12"
  },
  {
    id: "1027037",
    name: "Michael Brown",
    relationship: "Grandparent",
    email: "michael.brown@email.com",
    phone: "0217778888",
    note: "Lives nearby",
    newsletter: true,
    author: "Carea PHILPOTT",
    createdAt: "2024-01-11"
  }
]; 