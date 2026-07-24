"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export function useProject() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      });
  }, [id]);

  const save = async (fields: Record<string, any>, sectionKey?: string) => {
    setSaving(true);
    setSaved(false);

    const payload = { ...fields };
    if (sectionKey && project?.aiGeneratedFields?.includes(sectionKey)) {
      payload.aiGeneratedFields = project.aiGeneratedFields.filter((k: string) => k !== sectionKey);
    }

    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (payload.aiGeneratedFields) {
      setProject((prev: any) => ({ ...prev, aiGeneratedFields: payload.aiGeneratedFields }));
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return { id, project, setProject, loading, saving, saved, save };
}