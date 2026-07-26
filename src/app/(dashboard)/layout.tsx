import { auth } from "@/lib/auth";
import Link from "next/link";
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
      className="relative min-h-screen font-[Outfit] text-[#292524]"
      style={{
        background:
          "radial-gradient(circle at 15% 10%, rgba(216,90,48,0.10) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(240,153,123,0.12) 10%, transparent 40%), #FDFCF8",
      }}
    >
      <FontsAndGrain />

      <header
        className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2.5 border-b border-[rgba(228,223,210,0.6)] px-7 py-3.5 backdrop-blur-[16px]"
        style={{ background: "rgba(250, 247, 240, 0.65)" }}
      >
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span
            className="text-[17px] font-bold"
            style={{
              background: "linear-gradient(135deg, #D85A30, #F0997B)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ◆
          </span>
          <span className="text-base font-semibold text-[#2C2C2A]">ProjectVault</span>
        </Link>

        <SearchBar />

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <div className="flex items-center gap-2.5">
            <Link
              href="/settings"
              title="Profile"
              className="flex h-[30px] w-[30px] items-center justify-center rounded-full text-xs font-medium no-underline"
              style={{ background: "#F0997B", color: "#4A1B0C" }}
            >
              {session?.user?.name?.charAt(0).toUpperCase() || "?"}
            </Link>
            <button type="submit" className="border-none bg-transparent text-[13px] text-[#5F5E5A]">
              Log out
            </button>
          </div>
        </form>
      </header>

      <main className="relative p-7">{children}</main>
    </div>
  );
}

function FontsAndGrain() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Reenie+Beanie&display=swap');

        @keyframes pv-float {
          0%, 100% { transform: translateY(-10px); }
          50% { transform: translateY(10px); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
        }
      `}</style>
      <svg className="pointer-events-none fixed inset-0 z-50 h-0 w-0">
        <filter id="pv-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" stitchTiles="stitch" />
        </filter>
      </svg>
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.35] mix-blend-overlay"
        style={{ filter: "url(#pv-grain)" }}
      />
    </>
  );
}