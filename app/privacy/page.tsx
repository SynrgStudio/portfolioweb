import type { Metadata } from "next"
import TopBar from "@/components/top-bar"
import { Guides, Sheet } from "@/components/technical"

export const metadata: Metadata = {
  title: "Privacy — SynrgStudio",
  description: "SynrgStudio's privacy policy: this site and the studio's own tools.",
}

// La política de privacidad del sitio. Meta la pide como URL para la app que
// administra los anuncios del estudio (SynrgStudio ADS). Va en los dos idiomas,
// uno debajo del otro: es una página que casi nadie lee y tiene que poder leerse sin JavaScript.
const SECTIONS = [
  {
    lang: "en",
    title: "Privacy",
    updated: "Updated on 11 November 2026.",
    blocks: [
      ["This site", "synrgs.tech is a static site. It has no accounts, no cookies, no analytics and no tracking. The server that delivers it, Cloudflare, keeps the usual technical logs for a short time to keep it running and safe."],
      ["The ads app", "SynrgStudio ADS is an app of the studio itself, used only to create and measure SynrgStudio's own ads on Instagram and Facebook through Meta's Marketing API. It does not ask anyone to log in, and it does not collect, store or share personal data of the people who see the ads. The results it reads are the totals Meta reports to any advertiser, such as how many people saw an ad and how many conversations it started."],
      ["When you write to us", "If you write to the studio, by WhatsApp or any other channel, your message and your contact details are used only to answer you and to work on what you asked for. They are not sold or shared."],
      ["Contact and deletion", "To ask what we hold about you, or to have it deleted, write to the studio on Discord, nd_synrg, the same contact as on the home page."],
    ],
  },
  {
    lang: "es",
    title: "Privacidad",
    updated: "Actualizada el 11 de noviembre de 2026.",
    blocks: [
      ["Este sitio", "synrgs.tech es un sitio estático. No tiene cuentas, cookies, analíticas ni seguimiento. El servidor que lo entrega, Cloudflare, guarda por poco tiempo los registros técnicos habituales para que funcione y sea seguro."],
      ["La app de anuncios", "SynrgStudio ADS es una app del propio estudio, que se usa solo para crear y medir los anuncios de SynrgStudio en Instagram y Facebook con la API de marketing de Meta. No le pide a nadie que inicie sesión, y no junta, guarda ni comparte datos personales de quienes ven los anuncios. Los resultados que lee son los totales que Meta informa a cualquier anunciante, como cuántas personas vieron un anuncio y cuántas conversaciones empezó."],
      ["Cuando nos escribís", "Si le escribís al estudio, por WhatsApp o por cualquier otro medio, tu mensaje y tus datos de contacto se usan solo para responderte y trabajar en lo que pediste. No se venden ni se comparten."],
      ["Contacto y borrado", "Para saber qué datos tuyos tenemos, o pedir que se borren, escribile al estudio por Discord, a nd_synrg, el mismo contacto de la página principal."],
    ],
  },
] as const

export default function Privacy() {
  return (
    <>
      <Sheet />
      <Guides />
      <TopBar />
      <main className="mx-auto max-w-[44rem] px-6 pb-24 pt-32">
        {SECTIONS.map((s) => (
          <section key={s.lang} lang={s.lang} className="mb-20">
            <h1 className="text-4xl font-bold" style={{ fontStretch: "125%", letterSpacing: "-0.03em" }}>
              {s.title}
            </h1>
            <p className="mt-3 font-mono text-xs text-muted">{s.updated}</p>
            {s.blocks.map(([h, t]) => (
              <div key={h} className="mt-10">
                <h2 className="text-lg font-semibold text-ink">{h}</h2>
                <p className="mt-2 leading-relaxed text-body">{t}</p>
              </div>
            ))}
          </section>
        ))}
      </main>
    </>
  )
}
