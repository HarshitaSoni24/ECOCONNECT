import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import { useAuth } from "./AuthContext";

const DrivesContext = createContext();

export function DrivesProvider({ children }) {
  const { user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setDrives([]);
      setVolunteers([]);
      return;
    }
    fetchAll();
  }, [user]);

  async function fetchAll() {
    setLoading(true);
    const [d, v] = await Promise.all([
      supabase.from("drives").select("*").order("created_at", { ascending: false }),
      supabase.from("volunteers").select("*"),
    ]);
    if (!d.error) setDrives(d.data);
    if (!v.error) setVolunteers(v.data);
    setLoading(false);
  }

  async function addDrive({ title, note, lat, lng, radiusKm, date, time, complaintId }) {
    const { data, error } = await supabase
      .from("drives")
      .insert({
        ngo_id: user.id,
        title, note, lat, lng,
        radius_km: radiusKm,
        date, time,
        complaint_id: complaintId ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    setDrives((prev) => [data, ...prev]);
    return data;
  }

  async function updateDrive(id, patch) {
    const { data, error } = await supabase
      .from("drives").update(patch).eq("id", id).select().single();
    if (error) throw error;
    setDrives((prev) => prev.map((d) => (d.id === id ? data : d)));
  }

  // Citizen says "I'll volunteer 🙋"
  async function volunteer(driveId) {
    const { data, error } = await supabase
      .from("volunteers")
      .insert({ drive_id: driveId, user_id: user.id })
      .select()
      .single();
    if (error) throw error;
    setVolunteers((prev) => [...prev, data]);
  }

  // Citizen changes their mind
  async function unvolunteer(driveId) {
    const { error } = await supabase
      .from("volunteers")
      .delete()
      .eq("drive_id", driveId)
      .eq("user_id", user.id);
    if (error) throw error;
    setVolunteers((prev) =>
      prev.filter((v) => !(v.drive_id === driveId && v.user_id === user.id))
    );
  }

  const isVolunteering = (driveId) =>
    volunteers.some((v) => v.drive_id === driveId && v.user_id === user?.id);

  const volunteerCount = (driveId) =>
    volunteers.filter((v) => v.drive_id === driveId).length;

  return (
    <DrivesContext.Provider
      value={{ drives, loading, addDrive, updateDrive,
               volunteer, unvolunteer, isVolunteering, volunteerCount }}
    >
      {children}
    </DrivesContext.Provider>
  );
}

export const useDrives = () => useContext(DrivesContext);