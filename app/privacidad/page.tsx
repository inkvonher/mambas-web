import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso de Privacidad",
  description:
    "Aviso de Privacidad de Mambas Tattoo & Cuts conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.",
  robots: { index: true, follow: true },
};

const updatedAt = "13 de junio de 2026";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-4 py-20 text-white sm:px-6">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d6ad4a] hover:underline"
        >
          ← Volver al inicio
        </Link>

        <h1 className="mt-6 text-4xl font-black uppercase tracking-tight sm:text-5xl">
          Aviso de Privacidad
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          Última actualización: {updatedAt}
        </p>

        <div className="mt-10 space-y-8 leading-7 text-zinc-300">
          <section>
            <h2 className="mb-2 text-xl font-bold text-white">
              1. Responsable
            </h2>
            <p>
              <strong>Mambas Tattoo &amp; Cuts</strong> (en adelante,
              &quot;Mambas&quot;), con domicilio en Calle 1 Sur esquina Av. 25
              Sur, Centro, Playa del Carmen, Quintana Roo, México, es responsable
              del tratamiento y protección de tus datos personales conforme a la
              Ley Federal de Protección de Datos Personales en Posesión de los
              Particulares (LFPDPPP).
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-white">
              2. Datos personales que recabamos
            </h2>
            <p>
              Recabamos los datos que nos proporcionas de forma directa al
              registrarte o agendar una cita: nombre completo, número de teléfono
              o WhatsApp, fecha de cumpleaños y el servicio de tu interés
              (barbería, tatuaje o piercing). No recabamos datos personales
              sensibles ni datos financieros a través de este sitio.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-white">
              3. Finalidades del tratamiento
            </h2>
            <p className="mb-3">
              <strong>Finalidades primarias</strong> (necesarias para el
              servicio):
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>Gestionar tu registro y agendar tus citas.</li>
              <li>Contactarte para confirmar, reprogramar o dar seguimiento.</li>
              <li>
                Administrar el programa de lealtad y los beneficios asociados.
              </li>
            </ul>
            <p className="mb-3 mt-4">
              <strong>Finalidades secundarias</strong> (no necesarias, puedes
              oponerte):
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>
                Enviarte promociones, descuentos de cumpleaños y novedades.
              </li>
              <li>Invitarte a eventos y preventas exclusivas.</li>
            </ul>
            <p className="mt-4">
              Si no deseas que tus datos se usen para las finalidades
              secundarias, puedes manifestarlo enviando un correo a la dirección
              indicada en la sección 6.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-white">
              4. Transferencias y encargados
            </h2>
            <p>
              Tus datos se almacenan en servicios de infraestructura en la nube
              (Supabase y Vercel) que actúan como encargados del tratamiento
              únicamente para alojar la información en nuestro nombre.{" "}
              <strong>No vendemos, ni cedemos tus datos personales a terceros</strong>{" "}
              con fines comerciales. Solo se realizarán transferencias cuando lo
              exija una autoridad competente conforme a la ley.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-white">
              5. Derechos ARCO
            </h2>
            <p>
              Tienes derecho a Acceder, Rectificar y Cancelar tus datos
              personales, así como a Oponerte a su tratamiento o revocar el
              consentimiento que nos hayas otorgado. Para ejercer cualquiera de
              estos derechos, envía tu solicitud al correo de la sección 6,
              indicando tu nombre, el derecho que deseas ejercer y una forma de
              contacto. Responderemos en los plazos que marca la ley.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-white">
              6. Contacto
            </h2>
            <p>
              Para ejercer tus derechos ARCO, limitar el uso de tus datos o
              resolver cualquier duda sobre este aviso, escríbenos a:{" "}
              <a
                href="mailto:mambastattoo@gmail.com"
                className="font-semibold text-[#d6ad4a] hover:underline"
              >
                mambastattoo@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-white">
              7. Cambios al aviso de privacidad
            </h2>
            <p>
              Este aviso puede modificarse en cualquier momento para cumplir con
              actualizaciones legales o cambios en nuestras prácticas. Cualquier
              modificación se publicará en esta misma página, indicando la fecha
              de la última actualización.
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-[#d6ad4a]/20 pt-6">
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d6ad4a] hover:underline"
          >
            ← Volver al inicio
          </Link>
        </div>
      </article>
    </main>
  );
}
