export function isAnyYouTubeUrl(url: string): boolean {
    const anyYouTubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|music.youtube\.com)(\/.*)?$/;
    return anyYouTubeRegex.test(url);
}