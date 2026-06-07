import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import OptimizedImage from "./OptimizedImage";
import "./SupabaseImageUploader.css";

export default function SupabaseImageUploader({ value, onChange, label, bucket = "images", showPreview = true }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setMessage("");
  };

  const upload = async () => {
    if (!file) return setMessage("Choose a file first.");

    setUploading(true);
    setMessage("");

    const filePath = `uploads/${Date.now()}_${file.name}`;

    try {
      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, { cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;

      const { data: urlData } = await supabase.storage.from(bucket).getPublicUrl(filePath);
      const url = (urlData && (urlData.publicUrl || urlData.public_url)) || "";

      // call parent with the public URL
      if (onChange) onChange(url || filePath);
      setMessage("Uploaded successfully.");
    } catch (e) {
      console.error(e);
      setMessage("Upload failed: " + (e.message || e));
    } finally {
      setUploading(false);
    }
  };

  const manualChange = (e) => {
    const v = e.target.value;
    if (onChange) onChange(v);
  };

  return (
    <div className="uploader">
      {label && <div style={{ fontSize: 13, marginBottom: 6 }}>{label}</div>}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input type="file" accept="image/*" onChange={handleFile} />
        <button onClick={upload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <div style={{ marginTop: 8 }}>
        <input placeholder="Or paste image URL" value={value || ""} onChange={manualChange} style={{ width: "100%" }} />
      </div>

      {message && <p className="uploader-message">{message}</p>}
      {showPreview && value && (
        <div style={{ marginTop: 8 }}>
          <OptimizedImage src={value} alt="preview" style={{ maxWidth: 240, maxHeight: 160 }} />
        </div>
      )}
    </div>
  );
}
