import React, { useState } from 'react';
import { Users, UserPlus, Trash2, Phone, Mail, Check, MessageSquare } from 'lucide-react';
import { EmergencyContact } from '../types';

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
  onAddContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  onRemoveContact: (id: string) => void;
}

export const EmergencyContacts: React.FC<EmergencyContactsProps> = ({
  contacts,
  onAddContact,
  onRemoveContact,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Family');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddContact({
      name: name.trim(),
      relation,
      phone: phone.trim() || '+1 (555) 019-2834',
      email: email.trim() || 'safety@example.com',
      notifySms: true,
      notifyEmail: true,
    });

    setName('');
    setPhone('');
    setEmail('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white tracking-tight">Trusted Circle & SOS Network</h3>
            <p className="text-xs text-slate-400">
              Notified instantly via Amazon SNS during emergency distress
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/50 hover:bg-purple-900/50 text-purple-300 border border-purple-700/60 text-xs font-semibold transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Cancel' : 'Add Contact'}</span>
        </button>
      </div>

      {/* Add Contact Inline Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-400">
            New Emergency Guardian
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Maya Chen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Relationship</label>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="Family">Family</option>
                <option value="Partner">Partner</option>
                <option value="Roommate">Roommate</option>
                <option value="Friend">Friend</option>
                <option value="Campus Security">Campus Security</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Mobile Phone (SMS)</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Email Address</label>
              <input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
            >
              Save Guardian
            </button>
          </div>
        </form>
      )}

      {/* Contacts List */}
      <div className="space-y-2">
        {contacts.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">
            No contacts added yet. Add at least 1 emergency guardian.
          </p>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-white">{contact.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-purple-300 font-mono">
                    {contact.relation}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-slate-500" /> {contact.phone}
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-500" /> {contact.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href={`sms:${contact.phone}`}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Direct SMS"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => onRemoveContact(contact.id)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition-colors"
                  title="Remove contact"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
