"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useFinanceStore } from "@/store/useFinanceStore"
import { useSearchParams, useRouter } from "next/navigation"
import { Plus, ArrowDownCircle, ArrowUpCircle, Wallet, Calendar, Tags, CheckCircle2, CircleDashed, Trash2, Edit2, PieChart as PieChartIcon, AlignLeft } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { FinanceTransaction } from "@/types/database"

function FinanceClientContent() {
    const { transactions, categories, isLoading, fetchInitialData, toggleTransactionStatus, deleteTransaction } = useFinanceStore()
    const searchParams = useSearchParams()
    const router = useRouter()

    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

    const [isAddTxOpen, setIsAddTxOpen] = useState(false)
    const [initialTxType, setInitialTxType] = useState<'IN' | 'OUT' | undefined>(undefined)
    const [transactionToEdit, setTransactionToEdit] = useState<FinanceTransaction | undefined>(undefined)
    const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false)

    useEffect(() => {
        const action = searchParams.get('action')
        if (action === 'income' || action === 'expense') {
            setInitialTxType(action === 'income' ? 'IN' : 'OUT')
            setTransactionToEdit(undefined)
            setIsAddTxOpen(true)
            router.replace('/app/financas') // limpa a url
        }
    }, [searchParams, router])

    useEffect(() => {
        fetchInitialData(currentMonth, currentYear)
    }, [currentMonth, currentYear, fetchInitialData])

    // Metricas
    const { income, expense, pendingIncome, pendingExpense } = useMemo(() => {
        let i = 0, e = 0, pi = 0, pe = 0
        transactions.forEach(t => {
            if (t.type === 'IN') {
                if (t.status === 'PAID') i += Number(t.amount)
                else pi += Number(t.amount)
            } else {
                if (t.status === 'PAID') e += Number(t.amount)
                else pe += Number(t.amount)
            }
        })
        return { income: i, expense: e, pendingIncome: pi, pendingExpense: pe }
    }, [transactions])

    const balance = income - expense

    // Dados Grafico de Pizza (Despesas por Categoria)
    const pieData = useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'OUT' && t.status === 'PAID')
        const group: Record<string, { value: number, color: string }> = {}

        expenses.forEach(t => {
            const cat = categories.find(c => c.id === t.category_id)
            const name = cat ? cat.name : 'Sem Categoria'
            const color = cat ? cat.color : '#64748b'

            if (!group[name]) group[name] = { value: 0, color }
            group[name].value += Number(t.amount)
        })

        return Object.entries(group).map(([name, data]) => ({ name, value: data.value, color: data.color }))
    }, [transactions, categories])

    // Modificadores de Mes
    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1) }
        else { setCurrentMonth(currentMonth - 1) }
    }
    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1) }
        else { setCurrentMonth(currentMonth + 1) }
    }

    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-24">

            {/* Cabecalho e Filtros */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2"><Wallet className="text-blue-500" /> Finanças</h1>
                    <p className="text-sm text-gray-500 mt-1">Gerencie suas receitas e despesas com controle de status.</p>
                </div>

                <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-border">
                    <button onClick={prevMonth} className="px-3 py-1 hover:bg-white dark:hover:bg-slate-800 rounded shadow-sm transition-colors text-sm">&lt;</button>
                    <span className="font-semibold text-sm min-w-[120px] text-center">{monthNames[currentMonth]} {currentYear}</span>
                    <button onClick={nextMonth} className="px-3 py-1 hover:bg-white dark:hover:bg-slate-800 rounded shadow-sm transition-colors text-sm">&gt;</button>
                </div>
            </div>

            {/* Metricas Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Saldo Líquido</p>
                            <h2 className={`text-3xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                R$ {balance.toFixed(2).replace('.', ',')}
                            </h2>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><Wallet size={24} /></div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Receitas Feitas</p>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                R$ {income.toFixed(2).replace('.', ',')}
                            </h2>
                            {pendingIncome > 0 && <p className="text-xs text-orange-500 mt-2 font-medium">+ R$ {pendingIncome.toFixed(2).replace('.', ',')} aguardando</p>}
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-lg text-green-500"><ArrowUpCircle size={24} /></div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Despesas Pagas</p>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                R$ {expense.toFixed(2).replace('.', ',')}
                            </h2>
                            {pendingExpense > 0 && <p className="text-xs text-orange-500 mt-2 font-medium">+ R$ {pendingExpense.toFixed(2).replace('.', ',')} pendentes</p>}
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-lg text-red-500"><ArrowDownCircle size={24} /></div>
                    </div>
                </div>
            </div>

            {/* Area de Graficos e Controle */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Dashboard: Grafico de Despesas */}
                <div className="lg:col-span-1 bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col min-h-[300px]">
                    <h3 className="text-base font-semibold mb-4 flex items-center gap-2"><PieChartIcon size={18} className="text-purple-500" /> Despesas por Categoria</h3>
                    {pieData.length > 0 ? (
                        <div className="flex-1 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">Sem despesas pagas neste mês.</div>
                    )}
                </div>

                {/* Tabela de Transações */}
                <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-5 border-b border-border flex justify-between items-center">
                        <h3 className="text-base font-semibold flex items-center gap-2"><AlignLeft size={18} className="text-gray-400" /> Lançamentos do Mês</h3>
                        <div className="flex gap-2">
                            <button onClick={() => setIsCategoryManagerOpen(true)} className="text-xs font-medium px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                <Tags size={14} /> Categorias
                            </button>
                            <button onClick={() => { setTransactionToEdit(undefined); setIsAddTxOpen(true); }} className="text-xs font-medium px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1 shadow-sm">
                                <Plus size={14} /> Novo Lançamento
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-slate-50 dark:bg-slate-900/50">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">Status</th>
                                    <th className="px-5 py-3 font-semibold">Descrição</th>
                                    <th className="px-5 py-3 font-semibold">Data</th>
                                    <th className="px-5 py-3 font-semibold text-right">Valor</th>
                                    <th className="px-5 py-3 font-semibold text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                                            {isLoading ? "Buscando dados..." : "Nenhum lançamento encontrado neste mês."}
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map(t => {
                                        const cat = categories.find(c => c.id === t.category_id)
                                        return (
                                            <tr key={t.id} className="border-b border-border last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-5 py-4">
                                                    <button
                                                        onClick={() => toggleTransactionStatus(t.id, t.status)}
                                                        className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border transition-colors ${t.status === 'PAID'
                                                            ? 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20'
                                                            : 'bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20'
                                                            }`}
                                                    >
                                                        {t.status === 'PAID' ? <CheckCircle2 size={14} /> : <CircleDashed size={14} />}
                                                        {t.status === 'PAID' ? 'Pago' : 'Pendente'}
                                                    </button>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="font-medium text-foreground">{t.description}</div>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        {cat && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>}
                                                        <span className="text-xs text-gray-500">{cat ? cat.name : 'Outros'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-gray-500">
                                                    {new Date(t.date + 'T12:00:00Z').toLocaleDateString('pt-BR')}
                                                </td>
                                                <td className={`px-5 py-4 text-right font-semibold ${t.type === 'IN' ? 'text-green-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                                    {t.type === 'IN' ? '+ ' : '- '}R$ {Number(t.amount).toFixed(2).replace('.', ',')}
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button onClick={() => { setTransactionToEdit(t); setIsAddTxOpen(true); }} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors" title="Editar">
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button onClick={() => deleteTransaction(t.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" title="Excluir">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal: Adio Lançamento */}
            {isAddTxOpen && (
                <AddTransactionModal initialTxType={initialTxType} transactionToEdit={transactionToEdit} onClose={() => setIsAddTxOpen(false)} />
            )}

            {/* Modal: Categorias */}
            {isCategoryManagerOpen && (
                <CategoryManagerModal onClose={() => setIsCategoryManagerOpen(false)} />
            )}
        </div>
    )
}

function AddTransactionModal({ onClose, transactionToEdit, initialTxType }: { onClose: () => void, transactionToEdit?: FinanceTransaction, initialTxType?: 'IN' | 'OUT' }) {
    const { categories, createTransaction, updateTransaction } = useFinanceStore()
    const [desc, setDesc] = useState(transactionToEdit?.description || '')
    const [amount, setAmount] = useState(transactionToEdit ? String(transactionToEdit.amount) : '')
    const [type, setType] = useState<'IN' | 'OUT'>(transactionToEdit?.type || initialTxType || 'OUT')
    const [status, setStatus] = useState<'PAID' | 'PENDING'>(transactionToEdit?.status || 'PAID')
    const [date, setDate] = useState(transactionToEdit?.date || new Date().toISOString().split('T')[0])
    const [catId, setCatId] = useState<string>(transactionToEdit?.category_id || '')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const txData = {
            description: desc,
            amount: Number(amount.replace(',', '.')),
            type,
            status,
            date,
            category_id: catId || null
        }

        let ok = false
        if (transactionToEdit) {
            ok = await updateTransaction(transactionToEdit.id, txData)
        } else {
            ok = await createTransaction(txData)
        }

        if (ok) {
            onClose()
            // Recarrega os dados pra forçar att visual exata
            useFinanceStore.getState().fetchInitialData(new Date(date).getMonth(), new Date(date).getFullYear())
        }
        setLoading(false)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-md rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden">
                <div className="p-4 border-b border-border text-lg font-bold">{transactionToEdit ? 'Editar Lançamento' : 'Novo Lançamento'}</div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" onClick={() => setType('IN')} className={`py-3 rounded-lg border-2 font-bold transition-all ${type === 'IN' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-border text-gray-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>+ Receita</button>
                        <button type="button" onClick={() => setType('OUT')} className={`py-3 rounded-lg border-2 font-bold transition-all ${type === 'OUT' ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-border text-gray-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>- Despesa</button>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Descrição</label>
                        <input required autoFocus value={desc} onChange={e => setDesc(e.target.value)} type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Conta de Luz" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Valor (R$)</label>
                            <input required value={amount} onChange={e => setAmount(e.target.value)} type="number" step="0.01" className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Data</label>
                            <input required value={date} onChange={e => setDate(e.target.value)} type="date" className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Status</label>
                            <select value={status} onChange={e => setStatus(e.target.value as 'PAID' | 'PENDING')} className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="PAID">Efetuado (Pago/Recebido)</option>
                                <option value="PENDING">Pendente (Aguardando)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Categoria</label>
                            <select value={catId} onChange={e => setCatId(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Sem Categoria</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancelar</button>
                        <button disabled={loading} type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 flex items-center gap-2">
                            {loading && <CircleDashed size={14} className="animate-spin" />}
                            Salvar Transação
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function CategoryManagerModal({ onClose }: { onClose: () => void }) {
    const { categories, createCategory, updateCategory, deleteCategory } = useFinanceStore()
    const [name, setName] = useState('')
    const [color, setColor] = useState('#3b82f6')
    const [loading, setLoading] = useState(false)
    const [categoryToEdit, setCategoryToEdit] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return
        setLoading(true)

        if (categoryToEdit) {
            await updateCategory(categoryToEdit, name, color)
            setCategoryToEdit(null)
        } else {
            await createCategory(name, color)
        }

        setName('')
        setColor('#3b82f6')
        setLoading(false)
    }

    const startEdit = (id: string, currentName: string, currentColor: string) => {
        setCategoryToEdit(id)
        setName(currentName)
        setColor(currentColor)
    }

    const cancelEdit = () => {
        setCategoryToEdit(null)
        setName('')
        setColor('#3b82f6')
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-md rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden max-h-[80vh]">
                <div className="p-4 border-b border-border flex justify-between items-center text-lg font-bold">
                    Categorias
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none">&times;</button>
                </div>

                {/* Lista Existentes */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {categories.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">Nenhuma categoria criada.</p>}
                    {categories.map(c => (
                        <div key={c.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 border border-border p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: c.color }} />
                                <span className="font-medium text-sm">{c.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => startEdit(c.id, c.name, c.color)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors" title="Editar">
                                    <Edit2 size={14} />
                                </button>
                                <button onClick={() => deleteCategory(c.id)} className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" title="Excluir">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Nova / Editar Cat */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-border flex flex-col gap-2">
                    {categoryToEdit && (
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-semibold text-blue-500">Editando Categoria</span>
                            <button onClick={cancelEdit} className="text-xs text-gray-500 hover:text-gray-700 underline">Cancelar</button>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" title="Cor" />
                        <input required value={name} onChange={e => setName(e.target.value)} type="text" className="flex-1 bg-white dark:bg-slate-800 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={categoryToEdit ? "Nome da Categoria" : "Nova Categoria..."} />
                        <button disabled={loading} type="submit" className="p-1.5 bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-lg shadow-sm disabled:opacity-50">
                            {categoryToEdit ? <CheckCircle2 size={18} /> : <Plus size={18} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default function FinanceClientPage() {
    return (
        <Suspense fallback={<div className="p-10 flex justify-center"><CircleDashed className="animate-spin text-blue-500" /></div>}>
            <FinanceClientContent />
        </Suspense>
    )
}
