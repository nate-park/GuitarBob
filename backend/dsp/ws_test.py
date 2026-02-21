import asyncio, websockets, json

async def main():
    uri = "ws://127.0.0.1:8000/ws/listen"
    async with websockets.connect(uri) as ws:
        while True:
            msg = await ws.recv()
            print(json.loads(msg))

asyncio.run(main())