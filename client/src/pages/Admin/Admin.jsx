import { LogOutIcon } from "lucide-react";
import useAuth from "../../context/useAuth";

const Admin = () => {
  const { user, logout } = useAuth();

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <h1>*** Admin Dashboard ***</h1>
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
          <h2 className="admin-user">Hello {user?.name}</h2>
          <button className="admin-logout-btn" onClick={logout} title="Logout">
            <LogOutIcon size={24} />
            Logout
          </button>
          <p className="admin-intro">
            Here you can review and manage all entries in the system.
          </p>
        </div>
      </div>

      {/* ENTRIES TABLE */}
      <div className="entries-table-wrapper">
        <table className="entries-table">
          <thead></thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
