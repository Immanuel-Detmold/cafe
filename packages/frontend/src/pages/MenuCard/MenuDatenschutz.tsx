import MenuLegalLayout from './MenuLegalLayout'

const MenuDatenschutz = () => {
  return (
    <MenuLegalLayout>
      <article>
        <h1>Datenschutzerklärung</h1>

        <h2>1. Verantwortlicher</h2>
        <p>
          Christengemeinde Immanuel e. V.
          <br />
          Am Stoppelkamp 1a
          <br />
          32758 Detmold
          <br />
          E-Mail: info@immanuel-detmold.de
          <br />
          Telefon: +49 (0) 5231 7017586
        </p>

        <h2>2. Welche Daten wir erheben</h2>
        <p>
          Bei der Nutzung unserer digitalen Menükarte werden folgende Daten
          erhoben:
        </p>
        <ul>
          <li>
            <strong>Bestelldaten:</strong> Ausgewählte Produkte,
            Bestellzeitpunkt und Bestellnummer.
          </li>
          <li>
            <strong>Name (optional):</strong> Sie können freiwillig einen Namen
            eingeben, damit wir Ihre Bestellung zuordnen können. Dieser Name
            wird nicht überprüft — Sie können eingeben, was Sie möchten.
          </li>
          <li>
            <strong>Zahlungsdaten:</strong> Die Zahlungsabwicklung erfolgt über
            SumUp. Wir selbst speichern keine Kreditkarten- oder Bankdaten.
            SumUp verarbeitet Ihre Zahlungsdaten gemäß ihrer eigenen
            Datenschutzerklärung.
          </li>
        </ul>
        <p>
          Es ist <strong>keine Registrierung oder Kontoeröffnung</strong>{' '}
          erforderlich.
        </p>

        <h2>3. Zweck der Datenverarbeitung</h2>
        <p>
          Die erhobenen Daten werden ausschließlich zur Abwicklung Ihrer
          Bestellung verwendet sowie zur Erfüllung steuerlicher und
          buchhalterischer Pflichten.
        </p>

        <h2>4. Speicherung und Hosting</h2>
        <p>
          Die Bestelldaten werden bei Supabase gespeichert, einem
          Cloud-Datenbank-Dienst. Die Anwendung wird über GitHub Pages
          bereitgestellt. Diese Dienste können Serverlogs (z.&nbsp;B.
          IP-Adressen) im Rahmen ihres regulären Betriebs verarbeiten.
        </p>

        <h2>5. Zahlungsabwicklung durch SumUp</h2>
        <p>
          Zahlungen werden über SumUp Limited verarbeitet. Bei der Zahlung
          werden Ihre Zahlungsdaten direkt von SumUp erhoben und verarbeitet.
          Weitere Informationen finden Sie in der{' '}
          <a
            href="https://www.sumup.com/de-de/datenschutzbestimmungen/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Datenschutzerklärung von SumUp
          </a>
          .
        </p>

        <h2>6. Cookies und Tracking</h2>
        <p>
          Wir verwenden <strong>keine Tracking-Cookies</strong>, keine
          Analyse-Tools und keine Werbedienste. Es werden nur technisch
          notwendige Daten im Browser gespeichert (z.&nbsp;B. Warenkorbinhalt
          während der Sitzung).
        </p>

        <h2>7. Weitergabe an Dritte</h2>
        <p>
          Ihre Daten werden nicht an Dritte weitergegeben, außer im Rahmen der
          Zahlungsabwicklung durch SumUp und der oben genannten technischen
          Dienstleister (Supabase, GitHub).
        </p>

        <h2>8. Ihre Rechte nach DSGVO</h2>
        <p>Sie haben jederzeit das Recht auf:</p>
        <ul>
          <li>
            <strong>Auskunft</strong> über Ihre gespeicherten Daten (Art. 15
            DSGVO)
          </li>
          <li>
            <strong>Berichtigung</strong> unrichtiger Daten (Art. 16 DSGVO)
          </li>
          <li>
            <strong>Löschung</strong> Ihrer Daten (Art. 17 DSGVO)
          </li>
          <li>
            <strong>Einschränkung</strong> der Verarbeitung (Art. 18 DSGVO)
          </li>
          <li>
            <strong>Widerspruch</strong> gegen die Verarbeitung (Art. 21 DSGVO)
          </li>
        </ul>
        <p>
          Bitte wenden Sie sich dafür an:{' '}
          <a href="mailto:info@immanuel-detmold.de">info@immanuel-detmold.de</a>
        </p>

        <h2>9. Beschwerderecht</h2>
        <p>
          Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu
          beschweren, wenn Sie der Meinung sind, dass die Verarbeitung Ihrer
          Daten gegen die DSGVO verstößt.
        </p>

        <p className="text-muted-foreground mt-8 text-sm">Stand: April 2026</p>
      </article>
    </MenuLegalLayout>
  )
}

export default MenuDatenschutz
