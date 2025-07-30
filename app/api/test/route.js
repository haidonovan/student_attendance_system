export async function GET() {
  return new Response(
    JSON.stringify({ data: "Vann Is fucking person on earth" }),
    { status: 400, headers: { "Content-Type": "application/json" } }
  );
}
