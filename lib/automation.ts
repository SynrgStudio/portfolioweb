// El caso "De la venta a la placa", contado en detalle: qué etapas tiene,
// qué decide cada una y con qué se hizo. Todo sale del código y de las
// pruebas del sistema; no se publican direcciones, puertos ni credenciales.

import type { Lang } from "@/lib/copy"

export type AutomationCase = {
  pipelineLabel: string
  pipeline: { name: string; tech: string; what: string }[]
  numbers: { value: string; label: string }[]
  detailLabel: string
  groups: { title: string; rows: [string, string][] }[]
  stackLabel: string
  stack: string[]
}

export const automationCase: Record<Lang, AutomationCase> = {
  en: {
    pipelineLabel: "The path of a sale",
    pipeline: [
      { name: "Mercado Libre", tech: "POST · orders_v2", what: "A buyer pays and the sale is notified." },
      { name: "Cloudflare Tunnel", tech: "HTTPS → 127.0.0.1", what: "The only way in from the internet." },
      { name: "Local server", tech: "3 routes · the rest 404", what: "Filters the notice and answers 200." },
      { name: "Queue on disk", tech: "SQLite · WAL", what: "The notice is saved before the 200 goes back." },
      { name: "Orders API", tech: "GET /orders/{id}", what: "The order is read from Mercado Libre itself." },
      { name: "Sale", tech: "pack_id · once", what: "Carts are joined and repeats are dropped." },
      { name: "Finder", tech: "exact → fuzzy", what: "Finds the model file of every product." },
      { name: "Slicer", tech: "1 path per unit", what: "The models are loaded on the plate." },
    ],
    numbers: [
      { value: "500 ms", label: "is what Mercado Libre allows for an answer; the sale is on disk before that" },
      { value: "30 min", label: "between checks for sales whose notice never arrived" },
      { value: "3", label: "routes answer from the internet; everything else is a 404" },
      { value: "10", label: "automated tests, from the login to a restart mid-sale" },
    ],
    detailLabel: "How it was built",
    groups: [
      {
        title: "Receiving the notice",
        rows: [
          ["Disk first", "A notice is written to a SQLite database, in WAL mode with full sync, before Mercado Libre gets its answer. If the app stops right after, the sale is still there when it comes back."],
          ["A narrow filter", "A notice is accepted only if it carries this application's id, the orders topic, a connected account and an order number. Anything else is ignored."],
          ["A flood can't break it", "At most 300 notices a minute and 500 waiting are queued. All of them still get a 200, so Mercado Libre never switches the notices off."],
        ],
      },
      {
        title: "Checking the sale",
        rows: [
          ["Nothing is trusted", "The notice only says which order changed. The app asks Mercado Libre for that order with the seller's own token, so a forged notice can't make up a sale."],
          ["Paid, and only once", "An order that isn't paid yet waits for its next notice. Once it is recorded, resends and later changes such as shipping or invoicing never alert again."],
          ["Carts", "A cart arrives as several orders that share a pack id. The app waits a moment and shows them as a single sale."],
        ],
      },
      {
        title: "When something fails",
        rows: [
          ["Retries", "A failed request is tried again with a wait that doubles each time, from 15 seconds up to 15 minutes."],
          ["Safety net", "On start, on waking from sleep and every 30 minutes, it searches each account's paid orders of the last two days, in case a notice was lost."],
          ["Restarts", "A sale that was recorded but not yet shown when the app closed is shown once when it opens again."],
        ],
      },
      {
        title: "Accounts and security",
        rows: [
          ["Login", "OAuth with PKCE and a state value. A login link works once and expires in 10 minutes. Up to 5 seller accounts."],
          ["Tokens", "Each token is renewed two minutes before it expires. The renewal token is single-use, so the new pair is saved before it is used, and work running at the same time shares one renewal."],
          ["Secrets", "Keys and tokens are stored encrypted with Windows' own protection (DPAPI). None of them reaches the interface."],
          ["Exposure", "The local server listens on 127.0.0.1 only. From the internet, the tunnel is the one way to reach it."],
        ],
      },
      {
        title: "Finding the models",
        rows: [
          ["Matching", "The finder scans the model folders for STL, OBJ and 3MF files. An exact name wins; otherwise it scores each file by letter similarity and by shared words, and offers up to 8 candidates."],
          ["It learns", "When a product has to be picked by hand, the choice is remembered and used the next time that product sells."],
          ["Quantities", "Each model is sent to the slicer once per unit sold, up to 50, and the number can be changed before sending."],
          ["Found in use", "Browsers slow down the timers of a background tab to one a minute, so the finder's server took the silence for a closed page and shut down after 41 seconds. It now closes when the page says it is leaving."],
        ],
      },
    ],
    stackLabel: "Made with",
    stack: ["TypeScript", "Electron", "SQLite", "Cloudflare Tunnel", "Mercado Libre API", "Python, standard library only"],
  },

  es: {
    pipelineLabel: "El camino de una venta",
    pipeline: [
      { name: "Mercado Libre", tech: "POST · orders_v2", what: "Un comprador paga y la venta se avisa." },
      { name: "Túnel de Cloudflare", tech: "HTTPS → 127.0.0.1", what: "La única entrada desde internet." },
      { name: "Servidor local", tech: "3 rutas · el resto 404", what: "Filtra el aviso y responde 200." },
      { name: "Cola en disco", tech: "SQLite · WAL", what: "El aviso se guarda antes de responder el 200." },
      { name: "API de órdenes", tech: "GET /orders/{id}", what: "La orden se lee del propio Mercado Libre." },
      { name: "Venta", tech: "pack_id · una vez", what: "Los carritos se unen y lo repetido se descarta." },
      { name: "Buscador", tech: "exacto → difuso", what: "Encuentra el archivo de cada producto." },
      { name: "Slicer", tech: "1 ruta por unidad", what: "Los modelos se cargan en la placa." },
    ],
    numbers: [
      { value: "500 ms", label: "da Mercado Libre para responder; la venta ya está en disco antes de eso" },
      { value: "30 min", label: "entre controles de ventas cuyo aviso nunca llegó" },
      { value: "3", label: "rutas responden desde internet; todo lo demás es un 404" },
      { value: "10", label: "pruebas automáticas, del login a un reinicio en medio de una venta" },
    ],
    detailLabel: "Cómo se hizo",
    groups: [
      {
        title: "Recibir el aviso",
        rows: [
          ["Primero al disco", "Un aviso se escribe en una base SQLite, en modo WAL con sincronización completa, antes de que Mercado Libre reciba su respuesta. Si la aplicación se cierra justo después, la venta sigue ahí cuando vuelve."],
          ["Un filtro angosto", "Un aviso se acepta solo si trae el id de esta aplicación, el tópico de órdenes, una cuenta conectada y un número de orden. Lo demás se ignora."],
          ["Una avalancha no lo rompe", "Se encolan como máximo 300 avisos por minuto y 500 en espera. Igual todos reciben un 200, para que Mercado Libre nunca desactive los avisos."],
        ],
      },
      {
        title: "Controlar la venta",
        rows: [
          ["No se confía en nada", "El aviso solo dice qué orden cambió. La aplicación le pide esa orden a Mercado Libre con el token del propio vendedor, así que un aviso falso no puede inventar una venta."],
          ["Pagada, y una sola vez", "Una orden que todavía no está pagada espera su próximo aviso. Una vez registrada, los reenvíos y los cambios posteriores, como el envío o la factura, no vuelven a avisar."],
          ["Carritos", "Un carrito llega como varias órdenes que comparten un pack id. La aplicación espera un momento y las muestra como una sola venta."],
        ],
      },
      {
        title: "Cuando algo falla",
        rows: [
          ["Reintentos", "Un pedido que falla se reintenta con una espera que se duplica cada vez, de 15 segundos hasta 15 minutos."],
          ["Red de seguridad", "Al abrir, al volver de suspensión y cada 30 minutos, busca las órdenes pagadas de los últimos dos días de cada cuenta, por si un aviso se perdió."],
          ["Reinicios", "Una venta registrada pero todavía no mostrada cuando la aplicación se cerró se muestra una vez cuando vuelve a abrir."],
        ],
      },
      {
        title: "Cuentas y seguridad",
        rows: [
          ["Login", "OAuth con PKCE y un valor de estado. Un enlace de login sirve una vez y vence a los 10 minutos. Hasta 5 cuentas de vendedor."],
          ["Tokens", "Cada token se renueva dos minutos antes de vencer. El token de renovación sirve una sola vez, así que el par nuevo se guarda antes de usarlo, y el trabajo que corre al mismo tiempo comparte una sola renovación."],
          ["Secretos", "Las claves y los tokens se guardan cifrados con la protección propia de Windows (DPAPI). Ninguno llega a la interfaz."],
          ["Exposición", "El servidor local escucha solo en 127.0.0.1. Desde internet, el túnel es la única forma de llegar."],
        ],
      },
      {
        title: "Encontrar los modelos",
        rows: [
          ["Coincidencia", "El buscador recorre las carpetas de modelos en busca de archivos STL, OBJ y 3MF. Un nombre exacto gana; si no, puntúa cada archivo por parecido de letras y por palabras en común, y ofrece hasta 8 candidatos."],
          ["Aprende", "Cuando un producto hay que elegirlo a mano, la elección se recuerda y se usa la próxima vez que ese producto se vende."],
          ["Cantidades", "Cada modelo se manda al slicer una vez por unidad vendida, hasta 50, y el número se puede cambiar antes de enviar."],
          ["Encontrado en uso", "Los navegadores frenan los temporizadores de una pestaña en segundo plano a uno por minuto, así que el servidor del buscador tomaba el silencio por una página cerrada y se apagaba a los 41 segundos. Ahora se cierra cuando la página avisa que se va."],
        ],
      },
    ],
    stackLabel: "Hecho con",
    stack: ["TypeScript", "Electron", "SQLite", "Cloudflare Tunnel", "API de Mercado Libre", "Python, solo biblioteca estándar"],
  },
}
