export async function onRequestPost({ request, env }: any) {
  const formData = await request.formData();

  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");

  const listId = Number(env.BREVO_LIST_ID);

  if (!listId || Number.isNaN(listId)) {
    return new Response(
      `BREVO_LIST_ID inválido: ${env.BREVO_LIST_ID}`,
      { status: 500 }
    );
  }

  const response = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": env.BREVO_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      attributes: {
        FIRSTNAME: name,
      },
      listIds: [listId],
      updateEnabled: true,
    }),
  });

  const brevoText = await response.text();

  if (!response.ok) {
    return new Response(
      `Erro Brevo: ${response.status}\n\n${brevoText}`,
      { status: response.status }
    );
  }

  return Response.redirect(new URL("/obrigado", request.url), 303);
}