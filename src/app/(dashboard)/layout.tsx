import { auth } from "@/lib/auth";
import { signOut } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F0" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          borderBottom: "0.5px solid #E4DFD2",
          background: "#FAF7F0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontWeight: 600, fontSize: "16px", color: "#D85A30" }}>◆</span>
          <span style={{ fontWeight: 500, fontSize: "16px", color: "#2C2C2A" }}>
            ProjectVault
          </span>
        </div>

        <input
          type="text"
          placeholder="Search or jump to..."
          style={{
            width: "280px",
            padding: "6px 12px",
            borderRadius: "8px",
            border: "0.5px solid #E4DFD2",
            fontSize: "13px",
            background: "#fff",
          }}
        />

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: "#F0997B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 500,
                color: "#4A1B0C",
              }}
            >
              {session?.user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <button
              type="submit"
              style={{
                fontSize: "13px",
                color: "#5F5E5A",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Log out
            </button>
          </div>
        </form>
      </header>

      <main style={{ padding: "24px" }}>{children}</main>
    </div>
  );
}