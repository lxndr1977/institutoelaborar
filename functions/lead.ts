export async function onRequestPost({ request, env }) {
  const formData = await request.formData();

  const name = formData.get("name");
  const email = formData.get("email");

  await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      attributes: {
        FIRSTNAME: name,
      },
      listIds: [Number(env.BREVO_LIST_ID)],
      updateEnabled: true,
    }),
  });

  return Response.redirect(new URL("/obrigado", request.url), 303);
}