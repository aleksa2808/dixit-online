dixit-online
============

Requires LAMP/WAMP and Redis.

Install with `composer install`.
Redis for Windows can be downloaded from https://github.com/ServiceStack/redis-windows/raw/master/downloads/redis-latest.zip and run by opening redis-server.exe.

Run with `php app/console server:run` && `php app/console gos:websocket:server` in two separate command windows.
The Redis server needs to be running and accepting connections on port 6379 (usually the default port).

