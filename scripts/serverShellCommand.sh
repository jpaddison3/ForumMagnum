#!/bin/bash
# Run Javascript in an existing server process. This works by putting the script
# into ./tmp/pendingShellCommands, where the server will detect it, run it then
# delete it. (See watchForShellCommands in serverStartup.ts)

WAIT=false
if [ "$1" = "--wait" ]; then
	WAIT=true
	shift
fi

COMMAND="$1"
echo "Checking that a local server is running..."
scripts/waitForServer.sh

OUTFILE=tmp/pendingShellCommands/command$$.js

mkdir -p tmp/pendingShellCommands
echo "$COMMAND" >$OUTFILE

if [ $WAIT = 1 ]; then
	while test -f "$OUTFILE"; do
		sleep 0.2
	done
fi
