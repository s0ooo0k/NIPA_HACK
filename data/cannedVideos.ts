type CannedVideo = {
  scenarioId: string;
  url: string;
};

// Pre-made videos for common scenarios to avoid generation cost.
export const cannedVideos: CannedVideo[] = [
  {
    scenarioId: "bap-meogeosseo",
    url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
  },
  {
    scenarioId: "daeume-boja",
    url: "https://sample-videos.com/video321/mp4/720/sample-5s.mp4",
  },
  {
    scenarioId: "eodi-ga",
    url: "https://sample-videos.com/video321/mp4/720/sample-10s.mp4",
  },
];

export function findCannedVideo(scenarioId: string): string | undefined {
  return cannedVideos.find((item) => item.scenarioId === scenarioId)?.url;
}
