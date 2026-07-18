import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Account Lens application", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Account Lens — Evidence-first GTM Copilot<\/title>/i);
  assert.match(html, /Turn a company list into a defensible shortlist\./);
  assert.match(html, /Demo mode · no API/);
  assert.match(html, /Import CSV/);
  assert.match(html, /Export CSV/);
  assert.match(html, /Nothing sends automatically\./);
  assert.match(html, /60-SECOND PRODUCT TOUR/);
  assert.match(html, /Reset demo/);
  assert.match(html, /Sample CSV/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("server-renders transparent scoring and human review controls", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /ICP score/);
  assert.match(html, /Score breakdown/);
  assert.match(html, /Approve account/);
  assert.match(html, /Hold/);
  assert.match(html, /Evidence/);
  assert.match(html, /Uncertainty/);
  assert.match(html, /Approve or hold/);
});
