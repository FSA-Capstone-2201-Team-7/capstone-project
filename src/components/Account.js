import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Avatar from "./Avatar";

const Account = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [password, setpassword] = useState(null);
  const [profilePicURL, setAvatarUrl] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("User")
        .select(`username, password, profilePicURL`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setpassword(data.password);
        setAvatarUrl(data.profilePicURL);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user.id,
        username,
        password,
        profilePicURL,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("User").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div aria-live="polite">
      {loading ? (
        "Saving ..."
      ) : (
        <form onSubmit={updateProfile} className="form-widget">
          <div className="form-widget">
            <Avatar
              url={profilePicURL}
              size={150}
              onUpload={(url) => {
                setAvatarUrl(url);
                updateProfile({ username, password, profilePicURL: url });
              }}
            />
          </div>
          )<div>Email: {session.user.email}</div>
          <div>
            <label htmlFor="username">Name</label>
            <input
              id="username"
              type="text"
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">password</label>
            <input
              id="password"
              type="text"
              value={password || ""}
              onChange={(e) => setpassword(e.target.value)}
            />
          </div>
          <div>
            <button className="button block primary" disabled={loading}>
              Update profile
            </button>
          </div>
        </form>
      )}
      <button
        type="button"
        className="button block"
        onClick={() => supabase.auth.signOut()}
      >
        Sign Out
      </button>
    </div>
  );
};

export default Account;
