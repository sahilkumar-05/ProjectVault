export default function Loading() {
  return (
    <div style={{ padding: "24px" }}>
      <div style={{ height: "24px", width: "200px", background: "#E4DFD2", borderRadius: "6px", marginBottom: "20px", animation: "pulse 1.5s ease-in-out infinite" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ height: "80px", background: "#fff", border: "0.5px solid #E4DFD2", borderRadius: "12px", animation: "pulse 1.5s ease-in-out infinite" }} />
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}