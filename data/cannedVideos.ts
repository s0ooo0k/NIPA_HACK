type CannedVideo = {
  scenarioId: string;
  url: string;
};

// Pre-made videos for common scenarios to avoid generation cost.
export const cannedVideos: CannedVideo[] = [
  {
    scenarioId: "bap-meogeosseo",
    url: "https://nipa-s3-hack.s3.us-east-1.amazonaws.com/babmeugeu.mp4",
  },
  {
    scenarioId: "daeume-boja",
    url: "https://nipa-s3-hack.s3.us-east-1.amazonaws.com/daeum.mp4",
  },
  {
    scenarioId: "mani-deuseyo",
    url: "https://nipa-s3-hack.s3.us-east-1.amazonaws.com/manimugu.mp4",
  },
  {
    scenarioId: "oneul-jom-bappeune",
    url: "https://nipa-s3-hack.s3.us-east-1.amazonaws.com/yageun.mp4",
  },
];

export function findCannedVideo(scenarioId: string): string | undefined {
  return cannedVideos.find((item) => item.scenarioId === scenarioId)?.url;
}
