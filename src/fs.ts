import { Duplex, Readable } from "stream";

export function bufferToStream(buffer: Buffer): Readable {
	const stream = new Duplex();
	stream.push(buffer);
	stream.push(null);

	return stream;
}

export async function streamToBuffer(stream: Readable): Promise<Buffer> {
	const chunks = [];
	for await (let chunk of stream) {
		chunks.push(chunk);
	}
	return Buffer.concat(chunks);
}
