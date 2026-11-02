# bindings.sh — reduced profile. Sourced by .cicd/ops.sh; do not edit ops.sh.
#
# Static Astro site: `astro build` writes dist/, and whatever serves those
# files is the runtime. dev runs `astro dev` in the foreground; staging builds
# and backgrounds `astro preview`, tracked by port because preview writes no
# PID file.
#
# The port comes from project.yml (or an override in .env.cicd), never from a
# constant here, and every port probe goes through ops.sh's os_* helpers, so
# this file runs unchanged on the mac, Linux and Windows hosts.
# Every verb routes its commands through run() or guards on dry(), so
# --dry-run is honest here rather than refused.
OPS_DRY_RUN_SAFE=1

PORT="${E_PORTS:-}"; PORT="${PORT%% *}"   # prod declares no ports
LOG="$LOG_DIR/$ENV_NAME.log"
ASTRO="./node_modules/.bin/astro"

_deps() {
  [[ -x "$ASTRO" ]] && return 0
  need npm
  run npm ci
}

_status() {
  local pids; pids="$(os_port_pids "$PORT")"
  if [[ "$JSON" == 1 ]]; then
    printf '{"project":%s,"env":%s,"port":"%s","running":%s,"pids":%s}\n' \
      "$(json_str "$PROJECT")" "$(json_str "$ENV_NAME")" "$PORT" \
      "$([[ -n "$pids" ]] && echo true || echo false)" "$(json_str "$(echo $pids)")"
  elif [[ -n "$pids" ]]; then
    ok "$SLUG $ENV_NAME listening on :$PORT (pid $(echo $pids))"
  else
    note "$SLUG $ENV_NAME not listening on :$PORT"
  fi
}

_stop() {
  dry && { note "would stop the listener on :$PORT"; return 0; }
  os_kill_port "$PORT"
}

_start_preview() {
  dry && { note "would start astro preview on :$PORT, logging to $LOG"; return 0; }
  mkdir -p "$LOG_DIR"
  nohup "$ASTRO" preview --port "$PORT" --host >>"$LOG" 2>&1 & disown
  local i
  for i in $(seq 1 30); do os_port_busy "$PORT" && break; sleep 0.5; done
  os_port_busy "$PORT" || { err "astro preview did not bind :$PORT — see $LOG"; return 1; }
  ok "$SLUG staging up at ${E_URL}"
}

no_data() { err "static site — $1"; return 3; }

# ---- dev -------------------------------------------------------------------
dev_up()      { _deps; run "$ASTRO" dev --port "$PORT" "$@"; }
dev_down()    { _stop; }
dev_status()  { _status; }
dev_restart() { err "dev runs in the foreground with hot reload; Ctrl-C and run 'dev up' again"; return 3; }
dev_logs()    { err "dev logs go to the terminal running 'dev up'"; return 3; }

# ---- staging ---------------------------------------------------------------
# `up` always rebuilds, then (re)starts preview so the fresh dist/ is served.
# Rebuilding is safe against a running stack, and it makes `up` the one verb
# for "put my latest changes on staging". `restart` skips the build.
staging_up() {
  _deps
  run "$ASTRO" build
  os_port_busy "$PORT" && { _stop; sleep 1; }
  _start_preview
}
staging_down()    { _stop; }
staging_restart() { _stop; sleep 1; _start_preview; }
staging_status()  { _status; }
staging_logs()    { mkdir -p "$LOG_DIR"; touch "$LOG"; run tail -f "$LOG"; }

# ---- not applicable in any environment --------------------------------------
for _env in dev staging; do
  eval "${_env}_backup_db()    { no_data 'no database'; }"
  eval "${_env}_restore_db()   { no_data 'no database'; }"
  eval "${_env}_backup_files() { no_data 'no file state; the source is the repo and dist/ is rebuilt'; }"
  eval "${_env}_wipe()         { no_data 'no data to destroy; use down'; }"
done
unset _env
