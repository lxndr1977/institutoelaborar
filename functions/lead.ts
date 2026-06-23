export async function onRequestPost({ request, env }: any) {
  const formData = await request.formData();

  // --------------------------
  // TURNSTILE
  // --------------------------

  const turnstileToken = String(formData.get("cf-turnstile-response") || "");

  if (!turnstileToken) {
    return new Response("Validação de segurança ausente.", { status: 400 });
  }

  const captchaResponse = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
      }),
    },
  );

  const captchaResult = await captchaResponse.json();

  if (!captchaResult.success) {
    return new Response("Falha na validação de segurança.", { status: 400 });
  }

  // --------------------------
  // CAMPOS
  // --------------------------

  const firstName = String(formData.get("firstName") || "").trim();

  const lastName = String(formData.get("lastName") || "").trim();

  const email = String(formData.get("email") || "").trim();

  const whatsappRaw = String(formData.get("whatsapp") || "").trim();

  // --------------------------
  // VALIDAÇÕES
  // --------------------------

  if (firstName.length < 2) {
    return new Response("Nome inválido.", { status: 400 });
  }

  if (lastName.length < 2) {
    return new Response("Sobrenome inválido.", { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return new Response("Email inválido.", { status: 400 });
  }

  let whatsapp = whatsappRaw.replace(/\D/g, "");

  if (!whatsapp.startsWith("55")) {
    whatsapp = `55${whatsapp}`;
  }

  if (whatsapp.length < 12 || whatsapp.length > 13) {
    return new Response("WhatsApp inválido.", { status: 400 });
  }

  const listId = Number(env.BREVO_LIST_ID);

  if (Number.isNaN(listId) || listId <= 0) {
    return new Response("BREVO_LIST_ID inválido.", { status: 500 });
  }

  // --------------------------
  // BREVO
  // --------------------------

  const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": env.BREVO_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      attributes: {
        FIRSTNAME: firstName,
        LASTNAME: lastName,
        SMS: whatsapp,
      },
      listIds: [listId],
      updateEnabled: true,
    }),
  });

  const brevoBody = await brevoResponse.text();

  if (!brevoResponse.ok) {
    return new Response(`Erro Brevo: ${brevoResponse.status}\n${brevoBody}`, {
      status: brevoResponse.status,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
