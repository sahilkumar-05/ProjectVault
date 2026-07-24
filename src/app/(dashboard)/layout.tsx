import { auth } from "@/lib/auth";
import { signOut } from "@/lib/auth";
import SearchBar from "@/components/layout/SearchBar";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 15% %, rgba(216,90,48,0.10) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(240,153,123,0.12) 10%, transparent 40%), #F7F3EC",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 28px",
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "rgba(250, 247, 240, 0.65)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(228, 223, 210, 0.6)",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: "17px",
              background: "linear-gradient(135deg, #D85A30, #F0997B)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ◆
          </span>
          <span style={{ fontWeight: 600, fontSize: "16px", color: "#2C2C2A" }}>
            ProjectVault
          </span>
        </div>

     <SearchBar />

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #F0997B, #D85A30)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 600,
                color: "#fff",
                boxShadow: "0 2px 8px rgba(216,90,48,0.35)",
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

      <main style={{ padding: "28px", position: "relative" }}>{children}</main>
    </div>
  );
}