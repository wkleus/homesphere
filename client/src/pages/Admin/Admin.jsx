import { Edit, LogOutIcon, X } from "lucide-react";
import "./Admin.css";
import useAuth from "../../context/useAuth";
import { useState, useEffect } from "react";
import { ENTRIES_URL, ENTRY_URL } from "../../config/api";

const CATEGORIES = ["Apartment", "Chalet", "Residence", "Studio", "Townhouse"];
const ENERGY_CLASSES = ["A+", "A", "B", "C", "D", "E", "F", "G"];

// Default form state - matches PostgreSQL column names (snake_case)
const EMPTY_FORM = {
  address: "",
  category: "Apartment",
  is_available: true,
  energy_class: "B",
  rooms: "",
  square_meters: "",
  year_built: "",
  buy: "",
  rent: "",
  photo: "",
};

const Admin = () => {
  const { user, logout } = useAuth();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Fetch all property entries from backend API
  const fetchEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(ENTRIES_URL);
      if (!res.ok) throw new Error("Failed to fetch entries");
      const data = await res.json();
      setEntries(data || []);
    } catch (err) {
      setError(err.message);
      setFeedback({ type: "error", message: "Failed to load entries" });
    } finally {
      setLoading(false);
    }
  };

  // Load entries on mount - IIFE pattern avoids ESLint setState warning
  useEffect(() => {
    (async () => {
      await fetchEntries();
    })();
  }, []);

  // Populate form with entry data for editing
  // Backend returns camelCase, form uses snake_case for DB compatibility
  const openEdit = (entry) => {
    setForm({
      address: entry.address,
      category: entry.category,
      is_available: entry.isAvailable,
      energy_class: entry.energyClass,
      rooms: entry.rooms,
      square_meters: entry.squareMeters,
      year_built: entry.yearBuilt,
      buy: entry.buy ?? "",
      rent: entry.rent ?? "",
      photo: entry.photo,
    });
    setEditId(entry.id);
    setShowForm(true);
    setFeedback(null);
  };

  // Save updated entry - sends snake_case payload to backend
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const payload = {
        address: form.address,
        category: form.category,
        is_available: form.is_available,
        energy_class: form.energy_class,
        rooms: Number(form.rooms),
        square_meters: Number(form.square_meters),
        year_built: Number(form.year_built),
        buy: form.buy ? Number(form.buy) : null,
        rent: form.rent ? Number(form.rent) : null,
        photo: form.photo,
      };

      const res = await fetch(ENTRY_URL(editId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update entry");

      setFeedback({ type: "success", message: "Entry updated successfully!" });
      setShowForm(false);
      await fetchEntries();
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Generic handler for all form inputs (text + checkbox)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (loading) return <div className="admin-loading">Loading entries...</div>;
  if (error) return <div className="admin-loading">Error: {error}</div>;

  return (
    <div className="admin-page">
      {/* Header with user greeting and logout */}
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-header-actions">
          {/*
          NOTE:
          `user.name` works because the Supabase user has a `name` field inside
          `raw_user_meta_data`. I added this manually via the SQL Editor so the
          RAW JSON looks like:

          "raw_user_meta_data": {
            "name": "Max Mustermann",
            "email_verified": true
          }

          Supabase automatically maps this to:
          - user.user_metadata.name
          - and also exposes it as user.name
        */}
          <h2 className="admin-user">
            Hello, {user?.user_metadata?.name || user?.email}
          </h2>
          <button className="admin-logout-btn" onClick={logout} title="Logout">
            <LogOutIcon size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Success/error feedback messages */}
      {feedback && (
        <div className={`admin-feedback ${feedback.type}`}>
          {feedback.message}
        </div>
      )}

      {/* Entries table */}
      <div className="entries-table-wrapper">
        <table className="entries-table">
          <thead className="entries-table-head">
            <tr>
              <th>ID</th>
              <th>Address</th>
              <th>Category</th>
              <th>Rooms</th>
              <th>m²</th>
              <th>Year</th>
              <th>Energy</th>
              <th>Available</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="entries-table-body">
            {entries.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  No entries found.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.id}</td>
                  <td>{entry.address}</td>
                  <td>{entry.category}</td>
                  <td>{entry.rooms}</td>
                  <td>{entry.squareMeters}</td>
                  <td>{entry.yearBuilt}</td>
                  <td>{entry.energyClass}</td>
                  <td>
                    <span
                      className={`admin-badge ${entry.isAvailable ? "available" : "unavailable"}`}
                    >
                      {entry.isAvailable ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    {entry.buy ? `EUR ${entry.buy.toLocaleString()}` : ""}
                    {entry.rent ? `EUR ${entry.rent}/mo` : ""}
                  </td>
                  <td className="admin-table-actions">
                    <button
                      className="admin-edit-btn"
                      onClick={() => openEdit(entry)}
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit form modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Edit Entry</h2>
              <button type="button" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <form className="admin-form" onSubmit={handleSave}>
              <div className="admin-form-grid">
                <div className="admin-field full">
                  <label>Address</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-field">
                  <label>Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-field">
                  <label>Energy Class</label>
                  <select
                    name="energy_class"
                    value={form.energy_class}
                    onChange={handleChange}
                  >
                    {ENERGY_CLASSES.map((e) => (
                      <option key={e}>{e}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-field">
                  <label>Rooms</label>
                  <input
                    type="number"
                    name="rooms"
                    value={form.rooms}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-field">
                  <label>Square Meters</label>
                  <input
                    type="number"
                    name="square_meters"
                    value={form.square_meters}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-field">
                  <label>Year Built</label>
                  <input
                    type="number"
                    name="year_built"
                    value={form.year_built}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-field">
                  <label>Buy Price (EUR)</label>
                  <input
                    type="number"
                    name="buy"
                    value={form.buy}
                    onChange={handleChange}
                    placeholder="Leave empty if rent only"
                  />
                </div>

                <div className="admin-field">
                  <label>Monthly Rent (EUR)</label>
                  <input
                    type="number"
                    name="rent"
                    value={form.rent}
                    onChange={handleChange}
                    placeholder="Leave empty if buy only"
                  />
                </div>

                <div className="admin-field full">
                  <label>Photo path</label>
                  <input
                    name="photo"
                    value={form.photo}
                    onChange={handleChange}
                    placeholder="/photos/residence_1.webp"
                    required
                  />
                </div>

                <div className="admin-field">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      name="is_available"
                      checked={form.is_available}
                      onChange={handleChange}
                    />
                    Available
                  </label>
                </div>
              </div>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-save-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
