import MenuLegalLayout from './MenuLegalLayout'

const MenuAGB = () => {
  return (
    <MenuLegalLayout>
      <article>
        <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>

        <h2>1. Geltungsbereich</h2>
        <p>
          Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen,
          die über die digitale Menükarte der Christengemeinde Immanuel e. V.
          aufgegeben werden.
        </p>

        <h2>2. Vertragspartner</h2>
        <p>
          Vertragspartner ist:
          <br />
          Christengemeinde Immanuel e. V.
          <br />
          Am Stoppelkamp 1a
          <br />
          32758 Detmold
          <br />
          E-Mail: info@immanuel-detmold.de
        </p>

        <h2>3. Bestellvorgang</h2>
        <p>
          Durch das Hinzufügen von Produkten zum Warenkorb und das Abschließen
          der Zahlung über SumUp geben Sie eine verbindliche Bestellung auf. Der
          Vertrag kommt mit der erfolgreichen Zahlungsbestätigung zustande.
        </p>

        <h2>4. Preise</h2>
        <p>
          Alle angegebenen Preise sind Endpreise in Euro (EUR) und enthalten die
          gesetzliche Mehrwertsteuer, sofern anfallend.
        </p>

        <h2>5. Zahlung</h2>
        <p>
          Die Zahlung erfolgt ausschließlich über den Zahlungsdienstleister
          SumUp. Mit Abschluss des Zahlungsvorgangs wird die Zahlung
          unwiderruflich ausgeführt.
        </p>

        <h2>6. Keine Rückerstattung</h2>
        <p>
          <strong>
            Mit Abschluss der Zahlung ist der Kauf verbindlich. Eine
            Rückerstattung des Kaufpreises ist grundsätzlich ausgeschlossen.
          </strong>
        </p>
        <p>
          Da es sich um Speisen und Getränke handelt, die unmittelbar nach
          Bestellung zubereitet werden, ist ein Widerruf gemäß § 312g Abs. 2 Nr.
          2 BGB ausgeschlossen.
        </p>

        <h2>7. Leistungserbringung</h2>
        <p>
          Die bestellten Speisen und Getränke werden vor Ort ausgegeben. Die
          Abholung erfolgt nach Fertigstellung — der aktuelle Status kann über
          die Bestellverfolgung eingesehen werden.
        </p>

        <h2>8. Haftung</h2>
        <p>
          Die Haftung richtet sich nach den gesetzlichen Bestimmungen. Für
          leicht fahrlässige Pflichtverletzungen haften wir nur bei Verletzung
          wesentlicher Vertragspflichten und nur in Höhe des vorhersehbaren,
          vertragstypischen Schadens.
        </p>

        <h2>9. Datenschutz</h2>
        <p>
          Informationen zur Verarbeitung Ihrer personenbezogenen Daten finden
          Sie in unserer <a href="/menu/datenschutz">Datenschutzerklärung</a>.
        </p>

        <h2>10. Anwendbares Recht</h2>
        <p>
          Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des
          UN-Kaufrechts.
        </p>

        <h2>11. Salvatorische Klausel</h2>
        <p>
          Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden,
          bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
        </p>

        <p className="text-muted-foreground mt-8 text-sm">Stand: April 2026</p>
      </article>
    </MenuLegalLayout>
  )
}

export default MenuAGB
