# Supabase Free Plan – Limits prüfen

Das Projekt `hmwxeqgcfhhumndveboe` (eu-central-1) läuft im Free Plan. Diese Anleitung sagt, welche Limits für
die Café-App zählen, wo man sie prüft und was man tut, bevor eins erreicht wird.

Limits laut Drittquellen (Stand 2026-11). Vor Entscheidungen die offizielle Seite prüfen:
<https://supabase.com/pricing>.

## Kurzcheck (einmal im Monat, 2 Minuten)

1. Im Repo-Root `zsh packages/supabase/scripts/free-plan-usage.sh` ausführen. Es zeigt DB-Größe, Storage pro
   Bucket, aktive Nutzer und die letzte Bestellung.
2. Im Dashboard **Organization → Usage** öffnen (<https://supabase.com/dashboard/org/_/usage>). Nur dort stehen
   Egress und Edge-Function-Aufrufe.
3. Werte in die Tabelle unten eintragen und mit dem Limit vergleichen. Ab ca. 70 % handeln (siehe „Wenn es eng
   wird“).

Supabase schickt außerdem E-Mails an den Organisations-Owner, wenn ein Limit fast erreicht ist: diese Mails nicht
wegfiltern.

## Die Limits und wo die App steht

| Limit                 | Free Plan                       | Stand 2026-11-16                      | Risiko     |
| --------------------- | ------------------------------- | ------------------------------------- | ---------- |
| Inaktivität           | Pause nach 7 Tagen ohne Nutzung | letzte Bestellung 2026-11-15          | **mittel** |
| Egress (Downloads)    | 5 GB / Monat                    | 0,67 GB (13 %), cached 0,08 GB        | mittel     |
| Datenbank             | 500 MB                          | 80 MB                                 | gering     |
| Storage (Dateien)     | 1 GB                            | ca. 10 MB (Bilder 8,5 MB, Audio 1 MB) | gering     |
| Edge-Function-Aufrufe | 500.000 / Monat                 | 84                                    | gering     |
| Aktive Nutzer         | 50.000 / Monat                  | 5                                     | keins      |
| Realtime              | 200 gleichzeitige Verbindungen  | Spitze 11 Verbindungen                | keins      |

### 1. Pause nach 7 Tagen ohne Nutzung (größtes Risiko)

Läuft eine Woche lang keine Anfrage gegen das Projekt, pausiert Supabase es. Dann geht nichts mehr: keine
Bestellungen, keine Menükarte, keine Ansagen. Gefährlich sind **Ferien, Sommerpause oder Feiertage**, in denen
das Café länger als eine Woche zu ist.

- Prüfen: Projektstatus im Skript (`ACTIVE_HEALTHY` ist gut) oder im Dashboard.
- Wenn pausiert: Dashboard → Projekt → **Restore project**. Das dauert einige Minuten.
- Vorbeugen: eine wöchentliche automatische Anfrage („Keep-alive“), z. B. ein Cronjob auf dem Pi oder ein
  geplanter Task in Coolify, der einmal pro Woche eine kleine Abfrage gegen die Datenbank schickt.

### 2. Egress: was aus Supabase heruntergeladen wird

Zählt jede Antwort aus Datenbank und Storage. Bei der App fallen vor allem die **Produktbilder** ins Gewicht:
Jeder Gast, der über den QR-Code die Menükarte öffnet, lädt sie herunter. 60 Bilder mit zusammen 8,5 MB, das
größte 572 KB.

- Prüfen: Dashboard → Usage → Egress.
- Vorbeugen: Bilder vor dem Hochladen verkleinern (ca. 800 px Breite, unter 150 KB reicht für die Menükarte).
- Die Audios zählen kaum: Der Pi lädt jede Datei nur einmal und spielt sie danach lokal ab.

### 3. Datenbank (500 MB)

Bei 80 MB weit weg. Größte eigene Tabelle ist `UserActions` (Protokoll aller Aktionen, 4 MB). Erst ab ca.
350 MB handeln: alte `UserActions` (z. B. älter als 2 Jahre) löschen. Über 500 MB wird die Datenbank
schreibgeschützt.

### 4. Storage (1 GB)

Ca. 10 MB belegt. Ein Abholset mit 99 Ansagen braucht 5–8 MB pro Stimme (Gemini als WAV ca. 12 MB). Alte Stimmen
in **Einstellungen → Stimme** löschen, wenn sie nicht mehr gebraucht werden. Der Bucket `test2` (2 Dateien) ist
ein Überbleibsel und kann weg.

### 5. Edge-Function-Aufrufe (500.000 / Monat)

Aufrufe kommen von SumUp-Zahlungen und vom Erzeugen neuer Audios. Bei ca. 80 Bestellungen pro Woche sind das
wenige tausend im Monat, weit unter dem Limit.

## Wenn es eng wird

1. Ursache im Dashboard → Usage finden (welche Kennzahl, seit wann).
2. Egress: Bilder verkleinern; prüfen, ob eine Seite unnötig oft neu lädt (z. B. `refetchInterval`).
3. Datenbank/Storage: alte Daten bzw. Dateien löschen (siehe oben).
4. Reicht das nicht: Upgrade auf **Pro** (ca. 25 $/Monat). Dann gibt es 8 GB Datenbank, 250 GB Egress, tägliche
   Backups und keine Pause mehr.
