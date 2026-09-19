#!/usr/bin/env bash
# Build, then start vinext with retries.
# The vinext prod server pre-reads every <64KB static file into an in-memory
# cache at boot. In a freshly-extracted sandbox this parallel burst sometimes
# hits a transient EIO; retrying the start (after a short settle) almost always
# clears it. The deploy waits for port 3000, so a later successful attempt is
# what matters.
set +e

echo ">>> building..."
pnpm build
BUILD_RC=$?
if [ "$BUILD_RC" -ne 0 ]; then
  echo ">>> build failed rc=$BUILD_RC"
  exit "$BUILD_RC"
fi

echo ">>> letting the filesystem settle before pre-cache read..."
sleep 3

for i in 1 2 3 4 5 6; do
  echo ">>> vinext start attempt $i"
  pnpm start
  RC=$?
  echo ">>> start exited rc=$RC (attempt $i)"
  if [ "$RC" -eq 0 ]; then
    echo ">>> server running"
    exit 0
  fi
  sleep 4
done

echo ">>> all start attempts failed"
exit 1
