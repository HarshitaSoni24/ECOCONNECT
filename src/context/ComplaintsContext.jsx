import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import { useAuth } from "./AuthContext";

const ComplaintsContext = createContext();

export function ComplaintsProvider({ children }) {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all complaints whenever someone logs in
  useEffect(() => {
    if (!user) {
      setComplaints([]);
      return;
    }
    fetchComplaints();
  }, [user]);

  async function fetchComplaints() {
    setLoading(true);
    const { data, error } = await supabase
      .from("complaints")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setComplaints(data);
    setLoading(false);
  }

  // Upload photo → returns its public URL
  async function uploadPhoto(file) {
    const filename = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("complaint-photos")
      .upload(filename, file);
    if (error) throw error;

    const { data } = supabase.storage
      .from("complaint-photos")
      .getPublicUrl(filename);
    return data.publicUrl;
  }

  async function addComplaint({ text, photoFile, lat, lng }) {
    let image_url = null;
    if (photoFile) image_url = await uploadPhoto(photoFile);

    const { data, error } = await supabase
      .from("complaints")
      .insert({ user_id: user.id, text, image_url, lat, lng })
      .select()
      .single();
    if (error) throw error;

    setComplaints((prev) => [data, ...prev]); // show instantly
    return data;
  }

  async function updateComplaint(id, patch) {
    const { data, error } = await supabase
      .from("complaints")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;

    setComplaints((prev) => prev.map((c) => (c.id === id ? data : c)));
  }

  return (
    <ComplaintsContext.Provider
      value={{ complaints, loading, addComplaint, updateComplaint, fetchComplaints }}
    >
      {children}
    </ComplaintsContext.Provider>
  );
}

export const useComplaints = () => useContext(ComplaintsContext);