import React, { useEffect, useState } from 'react';

function fetchJSON(url, options) {
    return fetch(url, options).then(r => r.json());
}

export default function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [form, setForm] = useState({ username: '', password: '', email: '', role: '' });
    const [roleForm, setRoleForm] = useState({ name: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        refresh();
    }, []);

    function refresh() {
        setLoading(true);
        Promise.all([
            fetchJSON('/api/users'),
            fetchJSON('/api/roles'),
        ]).then(([users, roles]) => {
            setUsers(users);
            setRoles(roles);
            setLoading(false);
        });
    }

    async function handleUserSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await fetchJSON('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            setForm({ username: '', password: '', email: '', role: '' });
            refresh();
        } catch (e) {
            setError('Failed to create user');
            setLoading(false);
        }
    }

    async function handleRoleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await fetchJSON('/api/roles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(roleForm),
            });
            setRoleForm({ name: '' });
            refresh();
        } catch (e) {
            setError('Failed to create role');
            setLoading(false);
        }
    }

    async function deleteUser(id) {
        setLoading(true);
        await fetch(`/api/users/${id}`, { method: 'DELETE' });
        refresh();
    }

    async function deleteRole(id) {
        setLoading(true);
        await fetch(`/api/roles/${id}`, { method: 'DELETE' });
        refresh();
    }

    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 900, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0001', padding: 32 }}>
            <h1 style={{ textAlign: 'center', color: '#2d3748' }}>Admin Panel</h1>
            {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <section style={{ flex: 1, minWidth: 320 }}>
                    <h2 style={{ color: '#4a5568' }}>Users</h2>
                    <form onSubmit={handleUserSubmit} style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <input required placeholder="Username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} style={inputStyle} />
                        <input required placeholder="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={inputStyle} />
                        <input required placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
                        <select required value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={inputStyle}>
                            <option value="">Select role</option>
                            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                        <button type="submit" disabled={loading} style={buttonStyle}>Add User</button>
                    </form>
                    <table style={tableStyle}>
                        <thead>
                            <tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th></th></tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>{roles.find(r => r.id === u.role)?.name || u.role}</td>
                                    <td><button onClick={() => deleteUser(u.id)} style={deleteButtonStyle} disabled={loading}>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
                <section style={{ flex: 1, minWidth: 320 }}>
                    <h2 style={{ color: '#4a5568' }}>Roles</h2>
                    <form onSubmit={handleRoleSubmit} style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <input required placeholder="Role name" value={roleForm.name} onChange={e => setRoleForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
                        <button type="submit" disabled={loading} style={buttonStyle}>Add Role</button>
                    </form>
                    <table style={tableStyle}>
                        <thead>
                            <tr><th>ID</th><th>Name</th><th></th></tr>
                        </thead>
                        <tbody>
                            {roles.map(r => (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{r.name}</td>
                                    <td><button onClick={() => deleteRole(r.id)} style={deleteButtonStyle} disabled={loading}>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
}

const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: 6,
    fontSize: 16,
};
const buttonStyle = {
    background: 'linear-gradient(90deg,#667eea,#5a67d8)',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '10px 16px',
    fontWeight: 600,
    fontSize: 16,
    cursor: 'pointer',
    marginTop: 4,
};
const deleteButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(90deg,#f56565,#e53e3e)',
    marginTop: 0,
};
const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#f9fafb',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
};
