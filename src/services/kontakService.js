/**
 * kontakService.js
 *
 * Sama seperti service lain di project ini:
 *  - VITE_API_URL tidak di-set → mode demo, form cuma disimulasikan (delay + log)
 *  - VITE_API_URL di-set → POST ke /api/kontak
 *
 * Backend disarankan expose:
 *   POST /api/kontak
 *   body: { nama, email, subjek, pesan }
 *   response: { success: boolean, message?: string }
 */

const API_URL = import.meta.env.VITE_API_URL;
const USE_DUMMY = !API_URL;

export async function kirimPesanKontak({ nama, email, subjek, pesan }) {
  if (USE_DUMMY) {
    console.info(
      "[kontakService] Mode demo — pesan tidak benar-benar dikirim:",
      { nama, email, subjek, pesan }
    );
    await new Promise((resolve) => setTimeout(resolve, 700));
    return { success: true };
  }

  const res = await fetch(`${API_URL}/kontak`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama, email, subjek, pesan }),
  });

  if (!res.ok) {
    throw new Error("Gagal mengirim pesan, silakan coba lagi.");
  }

  return await res.json();
}
