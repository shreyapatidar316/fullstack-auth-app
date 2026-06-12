import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Users } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/employees', {
          withCredentials: true
        });
        setEmployees(res.data);
      } catch (err) {
        setError('Failed to load employee data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out', err);
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <header className="nav-header">
        <div className="brand">AuthApp</div>
        <button onClick={handleLogout} className="btn" style={{ width: 'auto', backgroundColor: 'transparent', border: '1px solid var(--border-color)' }}>
          <LogOut size={18} style={{ marginRight: '0.5rem' }} />
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <div className="welcome-card">
          <div className="avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Welcome back, {user.username}!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
          </div>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Users size={24} color="var(--primary)" />
            <h3 style={{ fontSize: '1.25rem' }}>Employee Directory</h3>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Loading employee data...
            </div>
          ) : error ? (
            <div className="error-message">
              {error}
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Position</th>
                    <th>Department</th>
                    <th>Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                        No employees found in the database.
                      </td>
                    </tr>
                  ) : (
                    employees.map((emp) => (
                      <tr key={emp.id}>
                        <td style={{ fontWeight: '500' }}>{emp.name}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{emp.email}</td>
                        <td>{emp.position}</td>
                        <td>
                          <span className="badge">{emp.department}</span>
                        </td>
                        <td className="salary">
                          ${Number(emp.salary).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
