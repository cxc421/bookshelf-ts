import React, {FC} from 'react';
import {client} from 'utils/api-client';

type ProfileConfigParameter = Parameters<React.ProfilerOnRenderCallback>;
type ProfileConfig = {
  id: ProfileConfigParameter['0'];
  phase: ProfileConfigParameter['1'];
  actualDuration: ProfileConfigParameter['2'];
  baseDuration: ProfileConfigParameter['3'];
  startTime: ProfileConfigParameter['4'];
  commitTime: ProfileConfigParameter['5'];
  interactions: ProfileConfigParameter['6'];
  metadata: any;
};

let queue: ProfileConfig[] = [];

setInterval(sendProfileQueue, 5000);

function sendProfileQueue() {
  if (!queue.length) {
    return Promise.resolve({success: true});
  }
  const queueToSend = [...queue];
  queue = [];
  return client('profile', {data: queueToSend});
}

// By wrapping the Profile like this, we can set the onRender to whatever
// we want and we get the additional benefit of being able to include
// additional data and filter phases
type ProfilerProps = {
  id: string;
  metadata?: any;
  phases?: ProfileConfig['phase'][];
};
const Profiler: FC<ProfilerProps> = ({metadata, phases, ...props}) => {
  const reportProfile: React.ProfilerOnRenderCallback = (
    id, // the "id" prop of the Profiler tree that has just committed
    phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization
    startTime, // when React began rendering this update
    commitTime, // when React committed this update
    interactions, // the Set of interactions belonging to this update
  ) => {
    if (!phases || phases.includes(phase)) {
      queue.push({
        metadata,
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
      });
    }
  };
  return <React.Profiler onRender={reportProfile} {...props} />;
};

export {Profiler};
