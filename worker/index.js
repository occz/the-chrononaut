import { DurableObject } from "cloudflare:workers";

/* One Room = one duel. Two WebSockets at most; every message is relayed to the other player. */
export class Room extends DurableObject {
  async fetch(req) {
    if (req.headers.get("Upgrade") !== "websocket") return new Response("Expected a WebSocket", { status: 426 });
    const host = new URL(req.url).searchParams.get("h") === "1";
    const socks = this.ctx.getWebSockets();
    const [client, server] = Object.values(new WebSocketPair());
    const refuse = (m) => { server.accept(); server.send(JSON.stringify({ t: "err", m })); server.close(1008, "refused"); };
    if (socks.length >= 2) refuse("Room is full");
    else if (host && socks.length >= 1) refuse("That code is already in use. Try again.");
    else if (!host && socks.length === 0) refuse("No such room. Check the code.");
    else {
      this.ctx.acceptWebSocket(server);
      for (const s of this.ctx.getWebSockets()) s.send(JSON.stringify({ t: "peers", n: socks.length + 1 }));
    }
    return new Response(null, { status: 101, webSocket: client });
  }
  webSocketMessage(ws, msg) {
    for (const s of this.ctx.getWebSockets()) if (s !== ws) { try { s.send(msg); } catch (e) {} }
  }
  webSocketClose(ws) {
    const rest = this.ctx.getWebSockets().filter((s) => s !== ws);
    for (const s of rest) { try { s.send(JSON.stringify({ t: "peers", n: rest.length })); } catch (e) {} }
    try { ws.close(); } catch (e) {}
  }
}

export default {
  async fetch(req, env) {
    const u = new URL(req.url);
    if (u.pathname === "/ws") {
      const room = (u.searchParams.get("room") || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
      if (!room) return new Response("Missing room", { status: 400 });
      return env.ROOM.get(env.ROOM.idFromName(room)).fetch(req);
    }
    return env.ASSETS.fetch(req);
  },
};
