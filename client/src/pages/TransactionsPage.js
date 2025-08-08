// Tapahtumasivu: näyttää ja hallinnoi budjetin tulot ja menot
// Käyttäjä voi lisätä, muokata, poistaa ja viedä tapahtumia CSV-muodossa
// Lisäksi sivu näyttää yhteenvedon kategorioittain piirakkadiagrammilla
// Teknologiat: React, Axios, Recharts, file-saver, papaparse


import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";


// Иконки для категорий (эмодзи).Emojit kategorioille

const categoryIcons = {
    "Ruoka": "🍏",
    "Koulutus": "🎓",
    "Lapsi": "🧸",
    "Terveys": "💊",
    "Vaatteet": "👗",
    "Kahvi": "☕",
    "Koti": "🏡",
    "Vuokra": "🏠",
    "Vakuutukset": "🛡️",
    "Verot": "💸",
    "Tilaukset": "📦",
    "Laina": "💳",
    "Harrastukset": "⚽",
    "Säästöt": "💰",
    "Lääkkeet": "🩺",
    "Auto": "🚗",
    "Lasten menot": "🍼",
    "Palkka": "💼",
    "Tuki": "🎁",
    "Sivutulo": "📈",
    "Lahjat": "🎁",
    "Myynti": "💵"
};

// Цвета для диаграммы.  Värit piirakkakaaviolle

const chartColors = [
    "#2274A5", "#F75C03", "#F1C40F", "#53A548", "#A569BD", "#EC407A",
    "#FF7043", "#009688", "#00B8A9", "#FFD166", "#665191", "#7DCEA0"
];

// Категории доходов и расходов. Tulot ja menot kategoriat
const categories = {
    expense: [
        "Vuokra", "Vakuutukset", "Verot", "Tilaukset", "Laina", "Ruoka", "Vaatteet",
        "Harrastukset", "Säästöt", "Lääkkeet", "Auto", "Lasten menot"
    ],
    income: [
        "Palkka", "Tuki", "Sivutulo", "Lahjat", "Myynti"
    ]
};

function TransactionsPage() {
    const { id } = useParams();
    const { token } = useAuth();

    const [transactions, setTransactions] = useState([]);
    const [categoryStats, setCategoryStats] = useState([]);
    const [statsType, setStatsType] = useState("expense");

    // Для формы добавления. Lomake uuden tapahtuman lisäämistä varten
    const [type, setType] = useState("expense");
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Для редактирования. Muokkausta varten
    const [editId, setEditId] = useState(null);
    const [editType, setEditType] = useState("expense");
    const [editCategory, setEditCategory] = useState("");
    const [editAmount, setEditAmount] = useState("");
    const [editDate, setEditDate] = useState("");
    const [editComment, setEditComment] = useState("");

    useEffect(() => {
        if (!token) return;
        axios.get(`http://localhost:5000/api/transactions/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setTransactions(res.data)).catch(() => setTransactions([]));
    }, [id, token]);

    useEffect(() => {
        if (!token) return;
        axios.get(`http://localhost:5000/api/transactions/${id}/categories?type=${statsType}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setCategoryStats(res.data)).catch(() => setCategoryStats([]));
    }, [id, token, statsType, transactions.length]);

    // Итоговые суммы. Kokonaissummat
    const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0);
    const totalBalance = totalIncome - totalExpense;
    const totalStats = categoryStats.reduce((sum, r) => sum + Number(r.total), 0);

    // Добавить транзакцию. Lisää tapahtuma
    const handleAddTransaction = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");
        if (!category || !amount || !date) {
            setError("Täytä kaikki kentät.");
            return;
        }
        try {
            const res = await axios.post(`http://localhost:5000/api/transactions/${id}`, {
                type, category, amount: Number(amount), date, comment
            }, { headers: { Authorization: `Bearer ${token}` } });
            setTransactions([res.data, ...transactions]);
            setSuccess("Tapahtuma lisätty!");
            setCategory(""); setAmount(""); setComment(""); setDate(new Date().toISOString().slice(0, 10));
        } catch (err) {
            setError("Virhe tapahtuman lisäyksessä.");
        }
    };
    const handleExportCSV = () => {
        if (transactions.length === 0) return;
        // Формируем массив для CSV. Muodostetaan taulukko CSV-tiedostoa varten
        const csvData = transactions.map(t => ({
            Päivämäärä: t.date,
            Tyyppi: t.type === "expense" ? "Menot" : "Tulot",
            Kategoria: t.category,
            Summa: t.amount,
            Kommentti: t.comment
        }));
        const csv = Papa.unparse(csvData, { delimiter: ";" });
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, `budjetti_${id}_tapahtumat.csv`);
    };



    // Удалить транзакцию. Poista tapahtuma
    const handleDeleteTransaction = async (transactionId) => {
        if (!window.confirm("Haluatko poistaa tämän tapahtuman?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/transactions/${id}/${transactionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(transactions.filter(t => t.id !== transactionId));
            setSuccess("Tapahtuma poistettu!");
            setError("");
        } catch (err) {
            setError("Virhe poistettaessa tapahtumaa.");
            setSuccess("");
        }
    };

    // Начать редактирование. Aloita muokkaus
    const startEdit = (t) => {
        setEditId(t.id);
        setEditType(t.type);
        setEditCategory(t.category);
        setEditAmount(t.amount);
        setEditDate(t.date);
        setEditComment(t.comment);
    };
    const cancelEdit = () => setEditId(null);

    // Сохранить редактирование. Tallenna muokkaukset
    const saveEdit = async () => {
        setError(""); setSuccess("");
        if (!editCategory || !editAmount || !editDate) {
            setError("Täytä kaikki kentät.");
            return;
        }
        try {
            const res = await axios.put(`http://localhost:5000/api/transactions/${id}/${editId}`, {
                type: editType,
                category: editCategory,
                amount: Number(editAmount),
                date: editDate,
                comment: editComment
            }, { headers: { Authorization: `Bearer ${token}` } });
            setTransactions(transactions.map(tr => tr.id === editId ? res.data : tr));
            setSuccess("Tapahtuma päivitetty!");
            setEditId(null);
        } catch (err) {
            setError("Virhe muokattaessa tapahtumaa.");
        }
    };

    return (
        <div style={{ maxWidth: 900, margin: "30px auto", padding: 24 }}>
            <Link to="/budgets" style={{ marginBottom: 12, display: "inline-block" }}>← Takaisin budjetteihin</Link>
            <h2>Budjetin tapahtumat (ID: {id})</h2>
            {/* --- lisäyslomake --- */}
            <form onSubmit={handleAddTransaction} style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                <select value={type} onChange={e => setType(e.target.value)} style={{ padding: 8 }}>
                    <option value="expense">Menot</option>
                    <option value="income">Tulot</option>
                </select>
                <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: 8 }}>
                    <option value="">Kategoria</option>
                    {categories[type].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Summa (€)"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    style={{ width: 100, padding: 8 }}
                    min="0"
                />
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    style={{ padding: 8 }}
                />
                <input
                    type="text"
                    placeholder="Kommentti"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    style={{ width: 180, padding: 8 }}
                />
                <button type="submit" style={{ background: "#00875A", color: "#fff", border: "none", borderRadius: 4, padding: "8px 18px", fontWeight: "bold" }}>
                    + Lisää
                </button>
            </form>
            {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
            {success && <div style={{ color: "green", marginBottom: 10 }}>{success}</div>}
            {/* --- kokonaissummat --- */}
            <div style={{
                margin: "20px 0 24px 0", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap"
            }}>
                <span style={{ color: "#00875A", fontWeight: "bold" }}>
                    Tulot: {totalIncome} €
                </span>
                <span style={{ color: "#B00", fontWeight: "bold" }}>
                    Menot: {totalExpense} €
                </span>
                <div style={{
                    marginLeft: 10,
                    padding: "8px 18px",
                    background: "linear-gradient(90deg, #53A548 60%, #1abc9c 100%)",
                    color: "#fff", fontWeight: 700, fontSize: 20,
                    borderRadius: 16, boxShadow: "0 4px 18px #53a54822"
                }}>
                    Jää: {totalBalance} €
                </div>
            </div>
            {/* --- visualisointi --- */}
            <h3 style={{ marginTop: 30 }}>Yhteenveto kategorioittain</h3>
            <div style={{ marginBottom: 12 }}>
                <button
                    style={{ background: statsType === "expense" ? "#B00" : "#eee", color: statsType === "expense" ? "#fff" : "#444", border: "none", borderRadius: 4, padding: "6px 16px", marginRight: 8, cursor: "pointer" }}
                    onClick={() => setStatsType("expense")}
                >
                    Menot
                </button>
                <button
                    style={{ background: statsType === "income" ? "#00875A" : "#eee", color: statsType === "income" ? "#fff" : "#444", border: "none", borderRadius: 4, padding: "6px 16px", cursor: "pointer" }}
                    onClick={() => setStatsType("income")}
                >
                    Tulot
                </button>
            </div>
            {categoryStats.length === 0 ? (
                <div>Ei tapahtumia tässä kategoriassa.</div>
            ) : (
                <>
                    <div style={{ width: "100%", maxWidth: 400, height: 300, margin: "0 auto 28px auto" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryStats.map(row => ({
                                        name: row.category,
                                        value: Number(row.total)
                                    }))}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={45}
                                    label={({ name, percent }) =>
                                        `${name}: ${(percent * 100).toFixed(1)}%`
                                    }
                                    isAnimationActive={true}
                                >
                                    {categoryStats.map((row, idx) => (
                                        <Cell key={`cell-${idx}`} fill={chartColors[idx % chartColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={value => `${value} €`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{
                        display: "flex", flexWrap: "wrap", justifyContent: "center", margin: "18px 0 28px 0", gap: 18
                    }}>
                        {categoryStats.map((row, idx) => {
                            const percent = totalStats > 0 ? ((Number(row.total) / totalStats) * 100).toFixed(1) : 0;
                            return (
                                <div key={row.category} style={{ display: "flex", alignItems: "center", fontSize: 16 }}>
                                    <span style={{
                                        display: "inline-block", width: 18, height: 18, borderRadius: "50%",
                                        background: chartColors[idx % chartColors.length], marginRight: 7
                                    }} />
                                    <span style={{ fontSize: 19, marginRight: 3 }}>
                                        {categoryIcons[row.category] || "📁"}
                                    </span>
                                    <span style={{ fontWeight: 500, marginRight: 3 }}>{row.category}</span>
                                    <span style={{ color: "#00875A", fontWeight: "bold", marginLeft: 2 }}>{percent}%</span>
                                </div>
                            );
                        })}
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
                        <thead>
                            <tr style={{ background: "#fafafa" }}>
                                <th style={{ textAlign: "left", padding: 7 }}>Kategoria</th>
                                <th style={{ textAlign: "right", padding: 7 }}>Yhteensä</th>
                                <th style={{ textAlign: "right", padding: 7 }}>Osuus</th>
                                <th style={{ textAlign: "left", padding: 7 }}>Summa-arvot</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categoryStats.map((row, idx) => {
                                const percent = totalStats > 0 ? ((Number(row.total) / totalStats) * 100).toFixed(1) : 0;
                                return (
                                    <tr key={row.category} style={{ borderTop: "1px solid #eee" }}>
                                        <td style={{ padding: 7 }}>
                                            <span style={{ fontSize: 18, marginRight: 6, verticalAlign: "middle" }}>
                                                {categoryIcons[row.category] || "📁"}
                                            </span>
                                            {row.category}
                                        </td>
                                        <td style={{ padding: 7, textAlign: "right" }}>
                                            <span style={{ fontWeight: "bold" }}>{row.total} €</span>
                                        </td>
                                        <td style={{ padding: 7, textAlign: "right", color: "#00875A", fontWeight: "bold" }}>
                                            {percent} %
                                        </td>
                                        <td style={{ padding: 7 }}>
                                            {row.amounts
                                                .split(',')
                                                .map(num => Number(num).toLocaleString("fi-FI", { minimumFractionDigits: 0, maximumFractionDigits: 2 }))
                                                .join(', ')}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </>
            )}
            {/* --- tapahtumalistaus --- */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 40, marginBottom: 0 }}>
                <h3 style={{ margin: 0 }}>
                    Tapahtumat <span style={{ color: "#888", fontWeight: "normal" }}>({transactions.length})</span>
                </h3>
                <button
                    onClick={handleExportCSV}
                    style={{
                        background: "#2274A5", color: "#fff", border: "none", borderRadius: 5,
                        padding: "8px 22px", fontWeight: "bold", cursor: "pointer", fontSize: 15
                    }}
                    disabled={transactions.length === 0}
                >
                    Vie CSV:ksi
                </button>
            </div>

            {transactions.length === 0 ? (
                <div>Ei tapahtumia vielä.</div>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
                    <thead>
                        <tr style={{ background: "#f7f7f7" }}>
                            <th style={{ padding: 7, textAlign: "left" }}>Pvm</th>
                            <th style={{ padding: 7, textAlign: "left" }}>Tyyppi</th>
                            <th style={{ padding: 7, textAlign: "left" }}>Kategoria</th>
                            <th style={{ padding: 7, textAlign: "right" }}>Summa</th>
                            <th style={{ padding: 7, textAlign: "left" }}>Kommentti</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            editId === t.id ? (
                                <tr key={t.id} style={{ background: "#f1f7fa" }}>
                                    <td style={{ padding: 7 }}>
                                        <input
                                            type="date"
                                            value={editDate}
                                            onChange={e => setEditDate(e.target.value)}
                                            style={{ width: 120, padding: 6 }}
                                        />
                                    </td>
                                    <td style={{ padding: 7 }}>
                                        <select value={editType} onChange={e => setEditType(e.target.value)} style={{ padding: 6 }}>
                                            <option value="expense">Menot</option>
                                            <option value="income">Tulot</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: 7 }}>
                                        <select value={editCategory} onChange={e => setEditCategory(e.target.value)} style={{ padding: 6 }}>
                                            <option value="">Kategoria</option>
                                            {categories[editType].map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td style={{ padding: 7, textAlign: "right" }}>
                                        <input
                                            type="number"
                                            value={editAmount}
                                            onChange={e => setEditAmount(e.target.value)}
                                            style={{ width: 80, padding: 6 }}
                                        /> €
                                    </td>
                                    <td style={{ padding: 7 }}>
                                        <input
                                            type="text"
                                            value={editComment}
                                            onChange={e => setEditComment(e.target.value)}
                                            style={{ width: 120, padding: 6 }}
                                        />
                                    </td>
                                    <td style={{ padding: 7 }}>
                                        <button
                                            onClick={saveEdit}
                                            style={{ background: "#00875A", color: "#fff", border: "none", borderRadius: 3, padding: "4px 9px", marginRight: 6, cursor: "pointer" }}
                                            title="Tallenna"
                                        >✔</button>
                                        <button
                                            onClick={cancelEdit}
                                            style={{ background: "#eee", border: "none", borderRadius: 3, padding: "4px 9px", cursor: "pointer" }}
                                            title="Peruuta"
                                        >✕</button>
                                    </td>
                                </tr>
                            ) : (
                                <tr key={t.id} style={{ borderTop: "1px solid #eee" }}>
                                    <td style={{ padding: 7 }}>{t.date}</td>
                                    <td style={{ padding: 7 }}>{t.type === "expense" ? "Menot" : "Tulot"}</td>
                                    <td style={{ padding: 7 }}>
                                        <span style={{ fontSize: 18, marginRight: 6 }}>
                                            {categoryIcons[t.category] || "📁"}
                                        </span>
                                        {t.category}
                                    </td>
                                    <td style={{ padding: 7, textAlign: "right" }}>
                                        <span style={{
                                            color: t.type === "income" ? "#00875A" : "#B00",
                                            fontWeight: "bold"
                                        }}>
                                            {t.type === "income" ? "+" : "-"}{Number(t.amount).toLocaleString("fi-FI", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €
                                        </span>
                                    </td>
                                    <td style={{ padding: 7 }}>{t.comment}</td>
                                    <td style={{ padding: 7 }}>
                                        <button
                                            onClick={() => startEdit(t)}
                                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginRight: 6 }}
                                            title="Muokkaa"
                                        >🖉</button>
                                        <button
                                            onClick={() => handleDeleteTransaction(t.id)}
                                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                                            title="Poista tapahtuma"
                                        >🗑</button>
                                    </td>
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TransactionsPage;
