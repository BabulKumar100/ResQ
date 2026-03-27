'use client';

import { useState } from 'react';
import { Plus, X, Phone, Mail } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  type: 'family' | 'friend' | 'emergency_service' | 'other';
}

interface ContactManagerProps {
  onContactsChange?: (contacts: Contact[]) => void;
  initialContacts?: Contact[];
}

export function ContactManager({ onContactsChange, initialContacts = [] }: ContactManagerProps) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'family' as Contact['type'],
  });

  const addContact = () => {
    if (!formData.name) return;

    const newContact: Contact = {
      id: `contact_${Date.now()}`,
      name: formData.name,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      type: formData.type,
    };

    const updated = [...contacts, newContact];
    setContacts(updated);
    onContactsChange?.(updated);
    setFormData({ name: '', phone: '', email: '', type: 'family' });
    setShowForm(false);
  };

  const removeContact = (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    onContactsChange?.(updated);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Emergency Contacts</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          <Plus className="w-5 h-5" />
          Add Contact
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
          <input
            type="text"
            placeholder="Contact name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as Contact['type'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="family">Family</option>
            <option value="friend">Friend</option>
            <option value="emergency_service">Emergency Service</option>
            <option value="other">Other</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={addContact}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
            >
              Save Contact
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {contacts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No emergency contacts added yet</p>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  {contact.phone && (
                    <a href={`tel:${contact.phone}`} className="flex items-center gap-1 hover:text-red-600">
                      <Phone className="w-4 h-4" />
                      {contact.phone}
                    </a>
                  )}
                  {contact.email && (
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-1 hover:text-red-600">
                      <Mail className="w-4 h-4" />
                      {contact.email}
                    </a>
                  )}
                </div>
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded font-semibold">
                  {contact.type.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => removeContact(contact.id)}
                className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
