export default function uriToHttp(uri: string): string[] {
  const protocol = uri.split(":")[0].toLowerCase();
  switch (protocol) {
    case "data":
      return [uri];
    case "https":
      return [uri];
    case "http":
      return ["https" + uri.substr(4), uri];
    case "ipfs":
      const hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2];
      return [
        `https://cloudflare-ipfs.com/ipfs/${hash}/`,
        `https://ipfs.io/ipfs/${hash}/`,
      ];
    case "ipns":
      const name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2];
      return [
        `https://cloudflare-ipfs.com/ipns/${name}/`,
        `https://ipfs.io/ipns/${name}/`,
      ];
    default:
      return [];
  }
}
