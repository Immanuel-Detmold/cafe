# Pi5 print + audio server (`cafe-server`)

The café's local helper server: prints receipts on the network receipt printers and plays text-to-speech
announcements ("Bestellnummer 12 ist abholbereit!") through a speaker. Separate repo, separate host. Analysed and
reworked 2026-11-16.

## Access

| What         | Value                                                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SSH          | `ssh pi5` (Mac `~/.ssh/config`: `pi5.immanuel-detmold.de`, port **4522**, user `immanuel`, key `~/.ssh/pi5-immanuel`)                                  |
| Public URL   | `https://pi5.immanuel-detmold.de` (nginx + Let's Encrypt; DNS A-record kept current by `cafe-dns-updater` via IONOS API)                               |
| Health check | `curl https://pi5.immanuel-detmold.de/test-connection` → `{"message":"Connection successful ✔"}`                                                      |
| Hardware/OS  | Raspberry Pi 5, Debian (rpt kernel 6.12, aarch64), 8 GB RAM, 234 GB NVMe, hostname `Test`                                                              |
| Repo on Pi   | `~/cafe-server` (Pi's own GitHub deploy key)                                                                                                           |
| Repo on Mac  | `~/Documents/GitHub/cafe-server`, remote `git@github-personal:Immanuel-Detmold/cafe-server.git` (private; `gh` under the default account can't see it) |
| Tailscale    | `tailscaled` is running but **logged out** — not usable as a fallback path right now                                                                   |

Not installed on the Pi host: `deno`, `node`, `gh`, `claude`, `codex`. Deno only exists inside the container. Develop on
the Mac, push, then deploy on the Pi (below). Host shell is zsh with `cd`→`z`, `cat`→`batcat`, `rm`→`rm -vI` aliases.

## Stack (`docker compose`, all `restart: unless-stopped`)

| Container          | Role                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| `cafe-app`         | Deno 2.3.1 + Express (`src/server.ts`), port 8080 internal. Python 3 + pygame inside for playback |
| `cafe-nginx`       | :80/:443, HTTP→HTTPS, reverse proxy to `app:8080`                                                 |
| `cafe-certbot`     | Cert issue + 12 h renewal loop                                                                    |
| `cafe-dns-updater` | Alpine + curl, updates IONOS A-record every `DNS_INTERVAL` s                                      |

Audio: the USB sound card is ALSA **card 2** (C-Media USB Audio Device); compose passes `/dev/snd`, `group_add: 29`,
`AUDIODEV=plughw:2,0`. Host crontab runs `scripts/set_volume.sh` `@reboot`.

## Endpoints (`src/server.ts`)

All except `/test-connection` require `Authorization: Bearer <token>`: either a Supabase user access token (verified with
`supabase.auth.getUser`) or `apikey:<PRINT_SERVER_API_KEY>` (server-to-server, used by the `sumup-verify-create-order`
edge function via its `PRINT_SERVER_URL` / `PRINT_SERVER_API_KEY` secrets).

| Route                  | Body                                                     | Notes                                                                                                                                                                                               |
| ---------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /test-connection` | –                                                        | Used by `pages/Settings/NetworkPage`                                                                                                                                                                |
| `POST /play`           | `{ id }` (`TtsAudio.id`)                                 | `src/audio.ts`; plays a cached audio, downloading it from the `tts-audio` bucket on a local miss. 404 = not generated yet. Answers after playback finished; announcements are queued, never overlap |
| `POST /print-receipt`  | `PrintProps` (order, printers, org name/logo, menu link) | `src/print.ts`, ESC/POS over raw TCP to each printer; answers 200 before printing finishes                                                                                                          |

Frontend callers: `announce()` / `playOnSpeaker()` in `data/useTts.tsx` (used by `AudioPage`, `ReadyForPickup`,
`settings/voice`), `pages/NewOrder/utilityFunctions/runPrintReceipt.ts` (print). Base URL comes from
AppData `server_ip` via `getServerIp()` (`data/useAppData.tsx`), which returns `http://localhost:8080` when the
frontend runs on localhost.

Playback strategy (`playFile()`): `AUDIO_ENABLED=false` → skip; `AUDIO_PLAYBACK_URL` set → POST the file to
`scripts/audio-player.py` on a host; otherwise `python src/playAudio.py <file>` (pygame) inside the container.

## Text-to-speech flow (since 2026-11-16)

1. The frontend computes `id = sha256(model \n voice \n text)` (`ttsAudioId()`, must match `audioId()` in the
   `tts` edge function) with the active `tts_model` / `voice` from AppData, and calls `POST /play { id }`.
2. Pi: local file `.data/tts-cache/<id>.<ext>` → play. Else look up `TtsAudio.storage_path`, download, play.
3. 404 (never generated): the frontend calls the `tts` edge function (`generate`), which calls OpenRouter
   `POST /api/v1/audio/speech`, uploads to the bucket and inserts the row; then retries `/play`.

So OpenRouter is only paid once per (model, voice, text). The pickup set (99 sentences, `kind = 'pickup'`, pinned) is
generated in bulk on `settings/voice`. The OpenRouter key lives in `AppSecrets` (`openrouter_api_key`), set and tested
on that page; neither the browser nor the Pi ever reads it. The Pi needs no AI key at all.

Daily maintenance (`maintainCache()`, first run 60 s after start, logs `TTS cache: …`): deletes unpinned audio not
played for 90 days from Supabase, deletes local files whose row is gone or that are unpinned and unplayed for 30 days
(file mtime = last play), and downloads every pinned audio that isn't local yet.

## Env (`~/cafe-server/.env`, values never in git)

`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` (service role, also used for TTS downloads and
cleanup), `OPENAI_API_KEY` and `RAPIDAPI_KEY` (both unused in code since 2026-11-16), `PORT`, `DOMAIN`, `CERTBOT_EMAIL`, `IONOS_API_KEY`/`_ZONE_ID`/`_RECORD_ID`, `DNS_INTERVAL`,
`PRINT_SERVER_API_KEY`, `AUDIO_ENABLED`. List names only: `ssh pi5 'sed "s/=.*//" ~/cafe-server/.env'`.

## Fast agent recipes (cheap, read-only)

```sh
ssh pi5 'docker logs --tail 50 cafe-app 2>&1'          # TTS / print errors land here
ssh pi5 'docker ps --format "{{.Names}}\t{{.Status}}"'
ssh pi5 'cd ~/cafe-server && git status -sb && git log -1 --oneline'
curl -s https://pi5.immanuel-detmold.de/test-connection
```

Deploy (a production write — confirm with Ronny first): push from the Mac clone, then
`ssh pi5 'cd ~/cafe-server && git pull --ff-only && docker compose up -d --build app'`. The image rebuild takes a few
minutes on the Pi (apt + `deno cache`); a pure code change rebuilds in seconds thanks to the layer cache. Last deploy:
2026-11-16, commit `73413d7`.

Test `/play` from the Pi without a user token: `K=$(docker exec cafe-app printenv PRINT_SERVER_API_KEY)` and
`-H "Authorization: Bearer apikey:$K"`. Note that a successful call really plays sound in the café.

## Known issues (2026-11-16)

- **Private SSH key tracked in git:** `backup/.ssh/id_ed25519` (plus `authorized_keys`, `known_hosts`, `.zshrc`) were
  committed before `.gitignore` excluded them. The repo is private, but the key should be rotated and the files removed
  from the index (`git rm --cached`).
- `.env` line `PRINT_SERVER_API_KEY =<…>` has a space before `=`; compose still loads it (verified via `docker exec cafe-app env`), but don't copy that style.
- `.data/speech.mp3` in the `app-data` volume is a leftover of the old OpenAI flow and can be deleted.
- `Dockerfile copy`, `test.py`, `test.ts`, `src/test.ts`, `ecosystem.config.js` (pm2, pre-Docker) are leftovers.
