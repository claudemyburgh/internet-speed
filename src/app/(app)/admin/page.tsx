import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  // Placeholder for admin metrics
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Total Tests</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">—</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active Users</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">—</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Avg Download</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">—</CardContent>
        </Card>
      </div>
    </div>
  );
}