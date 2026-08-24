export default function Loading() {
  return (
    <div className="px-8 py-8 max-w-5xl animate-pulse">
      <div className="h-6 w-48 rounded bg-border mb-2" />
      <div className="h-4 w-72 rounded bg-border mb-6" />
      <div className="card h-64" />
    </div>
  );
}
