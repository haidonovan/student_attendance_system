export async function GET() {
  return new Response(
    JSON.stringify({ data: "Hello World" }),
    { status: 400, headers: { "Content-Type": "application/json" } }
  );
}
