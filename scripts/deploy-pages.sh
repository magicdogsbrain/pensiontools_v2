#!/bin/sh
# Deploy docs/ to pensiontools.uk (Cloudflare Pages), with the release before's files kept beside it.
#
#   scripts/deploy-pages.sh [--previous vX.Y.Z] [--dry-run]
#
# Each build names its files by their contents, and a deploy of docs/ alone takes the release before's files off the
# site. A tab opened before the deploy still runs that release, and asks for its files later (the answer worker, and each
# part loaded on demand): the site would answer with its front page in their place. So the folder deployed here is docs/
# with the previous release's hashed files added (git archive <tag> docs/assets docs/classic/assets), never replacing a
# file of this build. Such a tab then carries on with its own files; one older than that loads itself again
# (src/utils/staleBuild.js).
#
# The previous release is the newest v* tag before this version's own (package.json), unless --previous names one.
# It refuses when the previous release's answer worker is missing from the folder it would deploy.
# --dry-run builds and checks the folder and prints the command, without deploying.
set -eu

ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"

PREV=""
DRY=0
while [ $# -gt 0 ]; do
  case "$1" in
    --previous) PREV="${2:-}"; shift 2 ;;
    --dry-run) DRY=1; shift ;;
    *) echo "deploy-pages: unknown option $1" >&2; exit 2 ;;
  esac
done

[ -f docs/index.html ] && [ -d docs/assets ] || { echo "deploy-pages: docs/ has no build (npm run build first)" >&2; exit 1; }

CUR="v$(node -p "require('./package.json').version")"
if [ -z "$PREV" ]; then
  # the newest tag before this release: before this version's own tag when it exists, else before HEAD
  if git rev-parse -q --verify "refs/tags/$CUR" >/dev/null; then FROM="$CUR^"; else FROM="HEAD"; fi
  PREV=$(git describe --tags --abbrev=0 --match 'v*' "$FROM" 2>/dev/null || true)
fi
[ -n "$PREV" ] || { echo "deploy-pages: no previous release tag found (name one with --previous)" >&2; exit 1; }
[ "$PREV" != "$CUR" ] || { echo "deploy-pages: the previous release is this one ($CUR)" >&2; exit 1; }
git rev-parse -q --verify "refs/tags/$PREV" >/dev/null || { echo "deploy-pages: no tag $PREV" >&2; exit 1; }

TMP=$(mktemp -d "${TMPDIR:-/tmp}/pt-deploy.XXXXXX")
SITE="$TMP/site"
OLD="$TMP/previous"
mkdir -p "$SITE" "$OLD"
cp -R docs/. "$SITE/"

# the previous release's hashed files: V7's at the root, and the classic page's when it had its own folder
PATHS="docs/assets"
if git cat-file -e "$PREV:docs/classic/assets" 2>/dev/null; then PATHS="$PATHS docs/classic/assets"; fi
# shellcheck disable=SC2086
git archive "$PREV" $PATHS | tar -x -C "$OLD"

added=0
for dir in assets classic/assets; do
  [ -d "$OLD/docs/$dir" ] || continue
  mkdir -p "$SITE/$dir"
  for f in "$OLD/docs/$dir"/*; do
    [ -f "$f" ] || continue
    name=$(basename "$f")
    if [ ! -e "$SITE/$dir/$name" ]; then cp "$f" "$SITE/$dir/$name"; added=$((added + 1)); fi
  done
done

# refuse unless the previous release's answer worker is in the folder (the file an open tab of that release asks for)
workers=$(ls "$OLD/docs/assets" 2>/dev/null | grep '^answerWorker-.*\.js$' || true)
[ -n "$workers" ] || { echo "deploy-pages: $PREV has no answer worker under docs/assets; refusing" >&2; exit 1; }
for w in $workers; do
  [ -f "$SITE/assets/$w" ] || { echo "deploy-pages: the previous worker assets/$w is missing from $SITE; refusing" >&2; exit 1; }
done

echo "deploy-pages: $CUR from docs/, with $added file(s) of $PREV kept beside it, in $SITE"
if [ "$DRY" = 1 ]; then
  echo "deploy-pages: dry run, not deployed. The command would be:"
  echo "  npx wrangler pages deploy $SITE --project-name=pension-planner-pwa --branch=main"
  exit 0
fi
npx wrangler pages deploy "$SITE" --project-name=pension-planner-pwa --branch=main
rm -rf "$TMP"
