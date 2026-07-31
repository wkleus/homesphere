import { DeleteIcon, Edit, LogOutIcon, Plus, X } from "lucide-react";
import "./Admin.css";
import useAuth from "../../context/useAuth";
import { useState, useEffect, useCallback } from "react";
import { ENTRIES_URL, ENTRY_URL, UPLOAD_URL } from "../../config/api";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { AnimatePresence } from "framer-motion";

// Available options for dropdown selectors
const CATEGORIES = ["Apartment", "Chalet", "Residence", "Studio", "Townhouse"];
const ENERGY_CLASSES = ["A+", "A", "B", "C", "D", "E", "F", "G"];

// EMPTY_FORM - Default form state matching PostgreSQL snake_case columns as initial state for new entries and resetting the form
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
  // AUTHENTICATION: Get user data, logout function, and JWT token from AuthContext
  const { user, logout, supabaseToken } = useAuth();

  // STATE MANAGEMEN for Data & UI states
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form & editing states
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Auto-dismiss the feedback banner after 4 seconds so it doesn't
  // linger indefinitely on screen.
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer); // prevent an old timer from prematurely clearing away a newer notification
  }, [feedback]);

  // Holds entry pending deletion (or null when the confirm modal is closed)
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* GET all property entries from the backend
     Sends JWT token in Authorization header for authentication
     Called on mount and after CRUD operations to refresh the list */
  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(ENTRIES_URL, {
        headers: {
          Authorization: `Bearer ${supabaseToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch entries");
      const data = await res.json();
      setEntries(data || []);
    } catch (err) {
      setError(err.message);
      setFeedback({ type: "error", message: "Failed to load entries" });
    } finally {
      setLoading(false);
    }
  }, [supabaseToken]);

  /* Load entries on component mount
     Re-fetch when token changes (login/refresh)
     IIFE pattern avoids ESLint setState-in-effect warning */
  useEffect(() => {
    (async () => {
      await fetchEntries();
    })();
  }, [fetchEntries]);

  /* Open the form modal for adding a new entry.
     Resets form to EMPTY_FORM and clears editId. */
  const openAddForm = () => {
    setForm(EMPTY_FORM);
    setEditId(null); // null indicates new entry (not editing)
    setShowForm(true);
    setFeedback(null);
  };

  /* Populate form with entry data for editing
     Maps backend camelCase to form snake_case for PostgreSQL compatibility */
  const openEdit = (entry) => {
    setForm({
      address: entry.address,
      category: entry.category,
      is_available: entry.isAvailable, // camelCase → snake_case
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

  /* handleDelete - Deletes an entry by ID - called only after user confirms in ConfirmModal */
  const handleDelete = async (id) => {
    // Show loading state on the modal's confirm button
    setDeleting(true);
    // Clear any previous feedback messages
    setFeedback(null);

    try {
      // Send DELETE request to backend
      const res = await fetch(ENTRY_URL(id), {
        method: "DELETE",
        headers: {
          // Include JWT token for authentication (required by backend)
          Authorization: `Bearer ${supabaseToken}`,
        },
      });

      // Handle different response status codes
      if (!res.ok) {
        // 401 Unauthorized – token expired or invalid
        if (res.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        // 404 Not Found – entry doesn't exist (maybe already deleted)
        if (res.status === 404) {
          throw new Error("Entry not found.");
        }
        // Other errors (500, etc.)
        throw new Error("Failed to delete entry");
      }

      // Success – show feedback and refresh list
      setFeedback({
        type: "success",
        message: "Entry deleted successfully!",
      });

      // Refresh the entries list to reflect changes
      await fetchEntries();
    } catch (err) {
      // Error handling
      setFeedback({
        type: "error",
        message: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      // Always reset loading state and close confirm modal
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  /* CREATE new entry OR UPDATE existing entry.
     If editId is null → POST (create new), otherwise PUT (update existing).
     Sends snake_case payload (matches PostgreSQL column names) */
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      // Build payload with snake_case keys for PostgreSQL compatibility
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

      // Determine method and URL based on editId (null = create, else update)
      const isCreating = editId === null;
      const url = isCreating ? ENTRIES_URL : ENTRY_URL(editId);
      const method = isCreating ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 401)
          throw new Error("Session expired. Please login again.");
        throw new Error(
          isCreating ? "Failed to create entry" : "Failed to update entry",
        );
      }

      // Show success message based on action
      setFeedback({
        type: "success",
        message: isCreating
          ? "Entry added successfully!"
          : "Entry updated successfully!",
      });
      setShowForm(false);
      await fetchEntries(); // Refresh list
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  /* Generic input handler for all form fields -> for text inputs, selects, and checkboxes */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* Uploads the selected photo file to the backend (which forwards it to
     Supabase Storage) and stores the returned public URL in form.photo.
     Runs immediately on file selection, before the entry itself is saved. */
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: {
          // NOTE: no Content-Type header here — the browser sets the
          // correct multipart/form-data boundary automatically.
          Authorization: `Bearer ${supabaseToken}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setForm((prev) => ({ ...prev, photo: data.url }));
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setUploading(false);
    }
  };

  // RENDER
  if (loading) return <div className="admin-loading">Loading entries...</div>;
  if (error) return <div className="admin-loading">Error: {error}</div>;

  return (
    <div className="admin-page">
      {/* Header with user greeting and logout */}
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-header-actions">
          {/*
          NOTE: `user.name` works because Supabase stores the name in `raw_user_meta_data`.
          Added via SQL Editor: "raw_user_meta_data": { "name": "Max Mustermann" }
          Supabase exposes this as: user.user_metadata.name or user.name
          */}
          <h2 className="admin-user">
            Hello, {user?.user_metadata?.name || user?.email}
          </h2>
          <button className="admin-logout-btn" onClick={logout} title="Logout">
            <LogOutIcon size={18} /> Logout
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`admin-feedback ${feedback.type}`}>
          {feedback.message}
        </div>
      )}

      {/* Entries table */}
      <div className="entries-table-wrapper">
        {/* Add New Entry button */}
        <div className="admin-table-actions-top">
          <button className="admin-add-btn" onClick={openAddForm}>
            <Plus size={18} /> Add New Entry
          </button>
        </div>

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
                    <button
                      className="admin-delete-btn"
                      onClick={() => setDeleteTarget(entry)}
                      title="Delete entry permanently"
                    >
                      <DeleteIcon size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/Add form modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editId === null ? "Add New Entry" : "Edit Entry"}</h2>
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
                  <label>Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                  />
                  {uploading && (
                    <p className="admin-upload-status">Uploading...</p>
                  )}
                  {form.photo && (
                    <img
                      src={form.photo}
                      alt="Preview"
                      className="admin-photo-preview"
                    />
                  )}
                  {/* Fallback for pasting an existing URL/path directly,
                      e.g. when re-using one of the seeded demo photos */}
                  <input
                    name="photo"
                    value={form.photo}
                    onChange={handleChange}
                    placeholder="/photos/residence_1.webp or https://..."
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
                  disabled={saving || uploading}
                >
                  {saving ? "Saving..." : editId === null ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteTarget && (
          <ConfirmModal
            title="Delete this property?"
            message={`"${deleteTarget.address}" will be permanently removed. This cannot be undone.`}
            confirmLabel="Delete"
            confirming={deleting}
            onConfirm={() => handleDelete(deleteTarget.id)}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
