// 'use client'

// import { useEffect, useState } from 'react'
// import { createClient } from '@/lib/supabase'
// import toast from 'react-hot-toast'
// import { Plus, Pencil, Trash2, X, Building2 } from 'lucide-react'

// interface BankAccount {
//   id: string
//   bank_name: string
//   account_name: string
//   account_number: string
//   description?: string
//   is_active: boolean
//   sort_order: number
// }

// const EMPTY: Partial<BankAccount> = {
//   bank_name: '', account_name: '', account_number: '',
//   description: '', is_active: true, sort_order: 0,
// }

// export default function AdminBankAccountsPage() {
//   const supabase = createClient()
//   const [items, setItems]     = useState<BankAccount[]>([])
//   const [loading, setLoading] = useState(true)
//   const [modal, setModal]     = useState(false)
//   const [form, setForm]       = useState<Partial<BankAccount>>({ ...EMPTY })
//   const [editing, setEditing] = useState<string | null>(null)
//   const [saving, setSaving]   = useState(false)

//   async function fetchItems() {
//     setLoading(true)
//     const { data } = await supabase.from('bank_accounts').select('*').order('sort_order')
//     setItems(data || [])
//     setLoading(false)
//   }

//   useEffect(() => { fetchItems() }, [])

//   function openNew() { setForm({ ...EMPTY, sort_order: items.length }); setEditing(null); setModal(true) }
//   function openEdit(item: BankAccount) { setForm({ ...item }); setEditing(item.id); setModal(true) }

//   async function handleSave(e: React.FormEvent) {
//     e.preventDefault()
//     if (!form.bank_name || !form.account_number) { toast.error('Bank name and account number are required'); return }
//     setSaving(true)
//     try {
//       if (editing) {
//         const { error } = await supabase.from('bank_accounts').update(form).eq('id', editing)
//         if (error) throw error
//         toast.success('Updated!')
//       } else {
//         const { error } = await supabase.from('bank_accounts').insert(form)
//         if (error) throw error
//         toast.success('Account added!')
//       }
//       setModal(false); fetchItems()
//     } catch (err: any) { toast.error(err.message) }
//     finally { setSaving(false) }
//   }

//   async function handleDelete(id: string) {
//     if (!confirm('Delete this account?')) return
//     await supabase.from('bank_accounts').delete().eq('id', id)
//     toast.success('Deleted'); fetchItems()
//   }

//   async function toggleActive(item: BankAccount) {
//     await supabase.from('bank_accounts').update({ is_active: !item.is_active }).eq('id', item.id)
//     fetchItems()
//   }

//   return (
//     <div className="p-6 sm:p-8 max-w-4xl mx-auto">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="font-display text-2xl font-bold text-gray-800">Bank Accounts</h1>
//           <p className="text-sm text-gray-500 font-body">Manage donation bank accounts shown on the donate page</p>
//         </div>
//         <button onClick={openNew} className="btn-primary text-sm gap-2"><Plus size={16} /> Add Account</button>
//       </div>

//       {loading ? <p className="text-sm text-gray-400 font-body">Loading...</p> : (
//         <div className="space-y-3">
//           {items.map(item => (
//             <div key={item.id} className={`card p-5 ${!item.is_active ? 'opacity-60' : ''}`}>
//               <div className="flex items-start justify-between gap-4">
//                 <div className="flex items-start gap-3">
//                   <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
//                     <Building2 size={18} className="text-primary-600" />
//                   </div>
//                   <div>
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <p className="font-semibold text-gray-800 font-body">{item.bank_name}</p>
//                       {!item.is_active && <span className="badge-gold text-xs">Hidden</span>}
//                     </div>
//                     <p className="text-sm text-gray-500 font-body">{item.account_name}</p>
//                     <p className="text-lg font-mono font-bold text-primary-700 mt-1">{item.account_number}</p>
//                     {item.description && <p className="text-xs text-gray-400 font-body mt-0.5">{item.description}</p>}
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-1 flex-shrink-0">
//                   <button
//                     onClick={() => toggleActive(item)}
//                     className={`text-xs px-2.5 py-1 rounded-lg font-body font-medium transition-colors ${
//                       item.is_active
//                         ? 'bg-green-50 text-green-700 hover:bg-green-100'
//                         : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
//                     }`}
//                   >
//                     {item.is_active ? 'Active' : 'Hidden'}
//                   </button>
//                   <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600"><Pencil size={15} /></button>
//                   <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={15} /></button>
//                 </div>
//               </div>
//             </div>
//           ))}
//           {items.length === 0 && (
//             <div className="text-center py-16 card p-8">
//               <Building2 size={36} className="text-gray-200 mx-auto mb-3" />
//               <p className="text-gray-500 font-body text-sm">No bank accounts added yet.</p>
//             </div>
//           )}
//         </div>
//       )}

//       {modal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
//             <div className="flex items-center justify-between p-5 border-b">
//               <h2 className="font-display text-lg font-semibold">{editing ? 'Edit Account' : 'Add Bank Account'}</h2>
//               <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
//             </div>
//             <form onSubmit={handleSave} className="p-5 space-y-4">
//               {[
//                 { label: 'Bank Name *',      key: 'bank_name',      placeholder: 'e.g. First Bank of Nigeria' },
//                 { label: 'Account Name *',   key: 'account_name',   placeholder: 'e.g. Muslim Corpers Association Oyo' },
//                 { label: 'Account Number *', key: 'account_number', placeholder: 'e.g. 1234567890' },
//                 { label: 'Description',      key: 'description',    placeholder: 'e.g. Main donations account' },
//               ].map(({ label, key, placeholder }) => (
//                 <div key={key}>
//                   <label className="form-label">{label}</label>
//                   <input className="form-input" value={(form as any)[key] || ''} placeholder={placeholder}
//                     onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
//                 </div>
//               ))}
//               <div>
//                 <label className="form-label">Sort Order</label>
//                 <input type="number" className="form-input" value={form.sort_order ?? 0}
//                   onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} />
//               </div>
//               <label className="flex items-center gap-2 text-sm font-body cursor-pointer">
//                 <input type="checkbox" checked={form.is_active ?? true}
//                   onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="rounded" />
//                 Show on donate page
//               </label>
//               <div className="flex gap-3 pt-2">
//                 <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
//                   {saving ? 'Saving...' : editing ? 'Update' : 'Add Account'}
//                 </button>
//                 <button type="button" onClick={() => setModal(false)} className="btn-outline">Cancel</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }




























'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Building2 } from 'lucide-react'

interface BankAccount {
  id: string
  bank_name: string
  account_name: string
  account_number: string
  description?: string
  is_active: boolean
  sort_order: number
}

const EMPTY: Partial<BankAccount> = {
  bank_name: '', account_name: '', account_number: '',
  description: '', is_active: true, sort_order: 0,
}

export default function AdminBankAccountsPage() {
  const supabase = createClient()
  const [items, setItems]     = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState<Partial<BankAccount>>({ ...EMPTY })
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving]   = useState(false)

  async function fetchItems() {
    setLoading(true)
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .order('sort_order')
    if (error) toast.error(error.message)
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  function openNew() {
    setForm({ ...EMPTY, sort_order: items.length })
    setEditing(null)
    setModal(true)
  }

  function openEdit(item: BankAccount) {
    setForm({ ...item })
    setEditing(item.id)
    setModal(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.bank_name || !form.account_number || !form.account_name) {
      toast.error('Bank name, account name and number are required')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        const { error } = await supabase
          .from('bank_accounts')
          .update(form)
          .eq('id', editing)
        if (error) throw error
        toast.success('Account updated!')
      } else {
        const { error } = await supabase
          .from('bank_accounts')
          .insert(form)
        if (error) throw error
        toast.success('Account added!')
      }
      setModal(false)
      fetchItems()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this bank account?')) return
    const { error } = await supabase.from('bank_accounts').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    toast.success('Deleted')
    fetchItems()
  }

  async function toggleActive(item: BankAccount) {
    const { error } = await supabase
      .from('bank_accounts')
      .update({ is_active: !item.is_active })
      .eq('id', item.id)
    if (error) { toast.error(error.message); return }
    fetchItems()
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">Bank Accounts</h1>
          <p className="text-sm text-gray-500 font-body">
            Manage donation accounts shown on the donate page
          </p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm gap-2">
          <Plus size={16} /> Add Account
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 font-body">Loading...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-20 card p-10">
          <Building2 size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-body">No bank accounts added yet.</p>
          <button onClick={openNew} className="btn-primary text-sm mt-4">
            Add First Account
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className={`card p-5 ${!item.is_active ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Building2 size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="font-semibold text-gray-800 font-body">{item.bank_name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-body font-medium ${
                        item.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {item.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 font-body">{item.account_name}</p>
                    <p className="text-lg font-mono font-bold text-primary-700 mt-1">
                      {item.account_number}
                    </p>
                    {item.description && (
                      <p className="text-xs text-gray-400 font-body mt-0.5">{item.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(item)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-body font-medium transition-colors border ${
                      item.is_active
                        ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                        : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {item.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => openEdit(item)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note */}
      <div className="mt-6 p-4 bg-gold-50 border border-gold-200 rounded-xl">
        <p className="text-xs text-gold-800 font-body">
          <strong>Note:</strong> Active accounts appear on the public donate page.
          Hidden accounts are saved but not shown to visitors.
          Sort order controls which account appears first.
        </p>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-display text-lg font-semibold">
                {editing ? 'Edit Bank Account' : 'Add Bank Account'}
              </h2>
              <button
                onClick={() => setModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="form-label">Bank Name *</label>
                <input
                  className="form-input"
                  value={form.bank_name || ''}
                  onChange={e => setForm(f => ({ ...f, bank_name: e.target.value }))}
                  placeholder="e.g. First Bank of Nigeria"
                  required
                />
              </div>
              <div>
                <label className="form-label">Account Name *</label>
                <input
                  className="form-input"
                  value={form.account_name || ''}
                  onChange={e => setForm(f => ({ ...f, account_name: e.target.value }))}
                  placeholder="e.g. Muslim Corpers Association Oyo"
                  required
                />
              </div>
              <div>
                <label className="form-label">Account Number *</label>
                <input
                  className="form-input font-mono text-lg tracking-wider"
                  value={form.account_number || ''}
                  onChange={e => setForm(f => ({ ...f, account_number: e.target.value }))}
                  placeholder="e.g. 1234567890"
                  required
                />
              </div>
              <div>
                <label className="form-label">Description</label>
                <input
                  className="form-input"
                  value={form.description || ''}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="e.g. Main donations account"
                />
              </div>
              <div>
                <label className="form-label">Sort Order (0 = first)</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.sort_order ?? 0}
                  onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))}
                />
              </div>
              <label className="flex items-center gap-2 text-sm font-body cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active ?? true}
                  onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                  className="rounded"
                />
                Show on donate page
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 justify-center"
                >
                  {saving ? 'Saving...' : editing ? 'Update Account' : 'Add Account'}
                </button>
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}